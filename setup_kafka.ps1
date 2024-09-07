docker exec kafka kafka-topics.sh --create `
  --topic deploy-tasks `
  --bootstrap-server localhost:9093 `
  --partitions 1 `
  --replication-factor 1

docker exec kafka kafka-topics.sh --create `
  --topic deploy-logs `
  --bootstrap-server localhost:9093 `
  --partitions 1 `
  --replication-factor 1