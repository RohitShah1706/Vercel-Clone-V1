## Use commitlint to adhere to a commit convention.

[Guild: Local Setup with commitlint](https://commitlint.js.org/#/guides-local-setup?id=install-commitlint)

1. Install commitlint

```powershell
# Install and configure commitlint cli
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Create & add this to commitlint.config.js file
module.exports = { extends: ['@commitlint/config-conventional'] };
```

2. Install husky

```powershell
# Install Husky v6
npm install husky --save-dev

# Activate hooks
npx husky install
```

3. Add hook

```powershell
npm pkg set scripts.commitlint="commitlint --edit"
npx husky add .husky/commit-msg 'npm run commitlint ${1}'
```

4. Commit with this convention: [Commit lint conventions](https://github.com/conventional-changelog/commitlint?tab=readme-ov-file#what-is-commitlint)

```powershell
git commit -m "chore: lint on commitmsg"
```

---

## Setting up AWS S3 bucket for file uploading

1. Create S3 bucket & Extract the `bucket name` and `region`

   ![alt text](screenshots/s3_setup_01.png)

   ```env
   AWS_S3_BUCKET_NAME=vercel-clone-s3-bucket
   AWS_S3_BUCKET_REGION=ap-south-1
   ```

2. Create IAM user with S3 full access to our `vercel-clone-s3-bucket` bucket.

   ![alt text](screenshots/s3_setup_02.png)
   ![alt text](screenshots/s3_setup_03.png)
   ![alt text](screenshots/s3_setup_04.png)
   ![alt text](screenshots/s3_setup_05.png)
   ![alt text](screenshots/s3_setup_06.png)

**Final policy should look like this**:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Action": ["s3:*"],
			"Resource": [
				"arn:aws:s3:::vercel-clone-s3-bucket",
				"arn:aws:s3:::vercel-clone-s3-bucket/*"
			]
		}
	]
}
```

3. Create `access key` and `secret key` for the user.

   ![alt text](screenshots/user_setup_01.png)
   ![alt text](screenshots/user_setup_02.png)
   ![alt text](screenshots/user_setup_03.png)

---

## Initialize an empty typescript project

```bash
npx tsc --init
```

Update `tsconfig.json` file configurations:

```json
{
	"compilerOptions": {
		// ...
		"rootDir": "./src",
		"outDir": "./dist"
		// ...
	}
}
```

```bash
npm i -D ts-node nodemon
```

Add in `package.json` file the following script to create dev server:

```json
	"scripts": {
		"dev": "nodemon --exec ts-node src/index.ts"
	},
```

---

## Setting up AWS S3 bucket locally with LocalStack

References:

1. https://dev.to/navedrizv/setup-aws-s3-bucket-locally-with-localstack-3n4o
2. https://iamads.medium.com/using-localstack-emulate-aws-s3-and-sqs-with-node-d43dda1d71c0

3. Install and start LocalStack

```bash
# Install LocalStack
pip install localstack

# Start LocalStack in docker mode, from a container
localstack start -d

# Install awslocal, which is a thin wrapper around the AWS CLI that allows you to access LocalStack
pip install awscli-local
```

2. Create a new Local AWS Profile (called "localstack") to work with LocalStack

```bash
PS D:\Projects\Vercel Clone> aws configure --profile localstack
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: ap-south-1
Default output format [None]:
```

3. Check if the profile is created

```bash
PS D:\Projects\Vercel Clone> aws configure list --profile localstack
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile               localstack           manual    --profile
access_key     ****************test shared-credentials-file
secret_key     ****************test shared-credentials-file
    region               ap-south-1      config-file    ~/.aws/config
```

4. Create S3 bucket ("vercel-clone-s3-bucket") with "localstack" profile using awslocal

```bash
# awslocal s3api create-bucket --bucket vercel-clone-s3-bucket --profile localstack
aws s3 mb s3://vercel-clone-s3-bucket --endpoint-url http://localhost:4566 --profile localstack

# List all buckets
aws s3 ls --endpoint-url http://localhost:4566 --profile localstack
```

5. List all files inside some bucket/<id> - here <id> comes after "upload-service" uploads the files to S3

```bash
aws s3 ls s3://vercel-clone-s3-bucket/clonedRepos/5b2abda7e18543df85f8d84814dda19f --recursive --endpoint-url http://localhost:4566 --profile localstack
```

## Errors faced

### Have to use `Promise.all` to wait for all files to be uploaded to S3 before pushing to Redis queue

In the below code seems like all files will first be uploaded to the S3 bucket and then the id will be pushed to the redis queue. But the problem is that the `forEach` does not wait for promises. So even though we're using `await` inside `forEach` callback, it only make the callback itself asynchronous, not the `forEach` loop, meaning `console.log` after `uploadFile` will be executed only when that particular file is uploaded to S3, but `publisher.lPush` will be executed immediately after the `forEach` loop is finished.

**Problem**:

```javascript
files.forEach(async (file) => {
	await uploadFile(file.slice(__dirname.length + 1), file);
	// console.log(`File ${file} uploaded to S3`);
});

// ! put the id on the redis "build-queue" for deploy-service to consume
publisher.lPush("build-queue", id);
```

**Solution**:

```javascript
await Promise.all(
	files.map((file) => {
		return uploadFile(file.slice(__dirname.length + 1), file);
	})
);

// Now all files have been uploaded, so we can push to the Redis queue
publisher.lPush("build-queue", id);
```

### Have to use hostname/<id> instead of id.hostname.com

<!-- ! all this cuz we don't have our domain name -->

To update in dist after build is done
Add /fcd2d166fac040b6aca85c0df529b5bd or /<id> before keyword

1. INDEX.HTML FILE "/assets/" -> "/fcd2d166fac040b6aca85c0df529b5bd/assets/"
2. INDEX.HTML FILE "/assets/" -> "/fcd2d166fac040b6aca85c0df529b5bd/assets/"
3. ASSETS/\*.JS FILE "/assets/" -> "/<id>/assets/"

---

## Todos

### Rotate SECRET_KEY

**Possible implementation**:

```javascript
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "myproject";

// Connect to MongoDB
mongoClient.connect(url, function (err, client) {
	const db = client.db(dbName);
	const collection = db.collection("envVars");

	// Retrieve all envVars
	collection.find({}).toArray(function (err, docs) {
		docs.forEach((doc) => {
			// Decrypt envVars using old key
			const decrypted = decrypt(doc.envVars, oldKey);

			// Encrypt envVars using new key
			const encrypted = encrypt(decrypted, newKey);

			// Update envVars in MongoDB
			collection.updateOne({_id: doc._id}, {$set: {envVars: encrypted}});
		});
	});

	client.close();
});
```

### Maintain common files for different services in a separate folder

Those files include:

- `src/config/index.ts`
- `src/connection/*`
- `src/controllers/*`
- `src/models/*`
- `src/cryptoUtis.ts`
- `src/file.ts`

### Shift to latest AWS SDK
