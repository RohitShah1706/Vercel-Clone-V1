aws s3 mb s3://vercel-clone-s3-bucket --endpoint-url http://localhost:4566
aws s3 cp ./404_not_found_template/ s3://vercel-clone-s3-bucket/404 --recursive --endpoint-url http://localhost:4566