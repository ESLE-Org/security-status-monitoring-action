const core = require("@actions/core")
const github = require("@actions/github");


const getLastPRStatus = `query($owner:String!, $repo:String!{
    repository(owner: $owner, name: $repo) {
      owner {
        id
      }
      primaryLanguage {
        name
      }
      description
      updatedAt
      languages(first: 100) {
        totalSize
        edges {
          size
          node {
            name
            color
            id
          }
        }
      }
      pullRequests(last: 1, states: OPEN) {
        edges {
          node {
            number
            url
            commits(last: 1) {
              nodes {
                commit {
                  commitUrl
                  oid
                  status {
                    contexts {
                      context
                      state
                      targetUrl
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`

async function run() {
  try {

    const myToken = core.getInput("githubToken")

    const octokit = github.getOctokit(myToken)
    // last pr check result
    const result = await octokit.graphql({
      query: getLastPRStatus,
      repo: github.context.payload.repository.name,
      owner: github.context.payload.repository.owner.name
    })

    console.log(result)

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }

}

run()