module.exports = {
  servers: {
    one: {
      host: '159.203.92.225',
      username: 'cnadler',
      // pem:
      password: 'Password1'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'meteor',
    path: '/Users/jacobkalodner/Documents/assessment',
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://educationetc.org',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60,
    
    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: false
  },

  mongo: {
    oplog: true,
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {},
    },
  },
};
