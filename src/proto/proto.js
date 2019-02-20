/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  framework: {
    nested: {
      PBMessageRequest: {
        fields: {
          type: {
            type: "uint32",
            id: 1
          },
          messageData: {
            type: "bytes",
            id: 2
          },
          timestamp: {
            type: "uint64",
            id: 3
          },
          version: {
            type: "string",
            id: 4
          },
          token: {
            type: "string",
            id: 14
          }
        }
      },
      PBMessageResponse: {
        fields: {
          type: {
            type: "uint32",
            id: 3
          },
          messageData: {
            type: "bytes",
            id: 4
          },
          resultCode: {
            type: "uint32",
            id: 6
          },
          resultInfo: {
            type: "string",
            id: 7
          }
        }
      },
      PBMessageType: {
        values: {
          getStudentList: 0
        }
      }
    }
  },
  mmp: {
    nested: {
      im: {
        nested: {
          common: {
            nested: {
              protocol: {
                options: {
                  java_outer_classname: "MessageTypeD"
                },
                nested: {
                  Message: {
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
                      },
                      type: {
                        type: "Type",
                        id: 4
                      },
                      data: {
                        type: "google.protobuf.Any",
                        id: 5
                      },
                      notifyIdList: {
                        rule: "repeated",
                        type: "string",
                        id: 6
                      }
                    },
                    nested: {
                      Type: {
                        values: {
                          FRIEND_MESSAGE: 0,
                          GROUP_MESSAGE: 1,
                          SERVER_REGISTER: 2,
                          CLIENT_LOGIN: 3,
                          CLIENT_LOGOUT: 4,
                          CLIENT_STATUS: 5,
                          BROADCAST_FRIEND_MESSAGE: 6,
                          BROADCAST_GROUP_MESSAGE: 7,
                          BROADCAST_CLIENT_STATUS: 8
                        }
                      },
                      FriendMessage: {
                        fields: {
                          data: {
                            type: "string",
                            id: 1
                          }
                        }
                      },
                      GroupMessage: {
                        fields: {
                          data: {
                            type: "string",
                            id: 1
                          }
                        }
                      },
                      ServerRegister: {
                        fields: {
                          id: {
                            type: "string",
                            id: 1
                          },
                          token: {
                            type: "string",
                            id: 2
                          },
                          data: {
                            type: "string",
                            id: 3
                          }
                        }
                      },
                      ClientLogin: {
                        fields: {
                          id: {
                            type: "string",
                            id: 1
                          },
                          token: {
                            type: "string",
                            id: 2
                          }
                        }
                      },
                      ClientLogout: {
                        fields: {
                          id: {
                            type: "string",
                            id: 1
                          },
                          token: {
                            type: "string",
                            id: 2
                          }
                        }
                      },
                      ClientStatus: {
                        fields: {
                          id: {
                            type: "string",
                            id: 1
                          },
                          serverId: {
                            type: "string",
                            id: 2
                          },
                          status: {
                            type: "bool",
                            id: 3
                          }
                        }
                      }
                    }
                  },
                  Acknowledge: {
                    fields: {
                      ack: {
                        type: "int64",
                        id: 1
                      }
                    }
                  },
                  Heartbeat: {
                    fields: {}
                  },
                  MessageLite: {
                    fields: {
                      from: {
                        type: "string",
                        id: 1
                      },
                      to: {
                        type: "string",
                        id: 2
                      },
                      type: {
                        type: "Type",
                        id: 3
                      },
                      data: {
                        type: "string",
                        id: 4
                      }
                    },
                    nested: {
                      Type: {
                        values: {
                          READ_MESSAGE: 0,
                          INPUT_NOW_MESSAGE: 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      Person: {
        fields: {
          name: {
            type: "string",
            id: 1
          },
          id: {
            type: "int32",
            id: 2
          },
          email: {
            type: "string",
            id: 3
          },
          phones: {
            rule: "repeated",
            type: "PhoneNumber",
            id: 4
          },
          type: {
            type: "PhoneType",
            id: 5
          },
          protoMap: {
            keyType: "string",
            type: "string",
            id: 6
          },
          data: {
            type: "google.protobuf.Any",
            id: 7
          }
        },
        nested: {
          PhoneType: {
            values: {
              MOBILE: 0,
              HOME: 1,
              WORK: 2
            }
          },
          PhoneNumber: {
            fields: {
              number: {
                type: "string",
                id: 1
              }
            }
          }
        }
      },
      AddressBook: {
        fields: {
          people: {
            rule: "repeated",
            type: "Person",
            id: 1
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          Any: {
            fields: {
              type_url: {
                type: "string",
                id: 1
              },
              value: {
                type: "bytes",
                id: 2
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
