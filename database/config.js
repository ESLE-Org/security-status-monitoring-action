const core = require("@actions/core")

const config = {
    endpoint: core.getInput("db_endpoint"),
    key: core.getInput("db_key"),
    databaseId: "MonitoringToolDB",
    partitionKey: { kind: "Hash", paths: ["/orgId"] }
};

module.exports = config;