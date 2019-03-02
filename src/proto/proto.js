/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  protoBean: {
    nested: {
      Heartbeat: {
        fields: {}
      },
      Acknowledge: {
        fields: {
          ack: {
            type: "int64",
            id: 1
          }
        }
      },
      FriendMessage: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          seqId: {
            type: "int64",
            id: 2
          },
          from: {
            type: "string",
            id: 3
          },
          to: {
            type: "string",
            id: 4
          },
          type: {
            type: "string",
            id: 5
          },
          content: {
            type: "string",
            id: 6
          }
        }
      },
      GroupMessage: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          seqId: {
            type: "int64",
            id: 2
          },
          from: {
            type: "string",
            id: 3
          },
          to: {
            type: "string",
            id: 4
          },
          type: {
            type: "string",
            id: 5
          },
          content: {
            type: "string",
            id: 6
          },
          broadcastIdList: {
            rule: "repeated",
            type: "string",
            id: 7
          }
        }
      },
      ServerRegister: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          severId: {
            type: "string",
            id: 2
          },
          token: {
            type: "string",
            id: 3
          },
          type: {
            type: "Type",
            id: 4
          }
        },
        nested: {
          Type: {
            values: {
              TCP: 0,
              WEBSOCKET: 1
            }
          }
        }
      },
      ClientLogin: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          userId: {
            type: "string",
            id: 2
          },
          token: {
            type: "string",
            id: 3
          },
          clientInfo: {
            type: "string",
            id: 4
          }
        }
      },
      ClientLogout: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          userId: {
            type: "string",
            id: 2
          },
          token: {
            type: "string",
            id: 3
          },
          clientInfo: {
            type: "string",
            id: 4
          }
        }
      },
      ClientStatus: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          userId: {
            type: "string",
            id: 2
          },
          serverId: {
            type: "string",
            id: 3
          },
          status: {
            type: "bool",
            id: 4
          },
          clientInfo: {
            type: "string",
            id: 5
          },
          broadcastIdList: {
            rule: "repeated",
            type: "string",
            id: 6
          }
        }
      },
      ReadMessage: {
        fields: {
          from: {
            type: "string",
            id: 1
          },
          to: {
            type: "string",
            id: 2
          },
          seqId: {
            type: "int64",
            id: 3
          },
          type: {
            type: "Type",
            id: 4
          }
        },
        nested: {
          Type: {
            values: {
              FRIEND: 0,
              GROUP: 1
            }
          }
        }
      },
      Inputting: {
        fields: {
          from: {
            type: "string",
            id: 1
          },
          to: {
            type: "string",
            id: 2
          }
        }
      },
      ApplyFriend: {
        fields: {
          seq: {
            type: "int64",
            id: 1
          },
          from: {
            type: "string",
            id: 2
          },
          to: {
            type: "string",
            id: 3
          }
        }
      }
    }
  }
});

module.exports = $root;
