<template>
  <div class="main">
    <div class="input-name" v-show="inputDisplay">
      <a-input placeholder="输入昵称后按回车进入聊天室" v-model="nickname" @keyup.enter="setName" />
    </div>

    <div v-show="messageDisplay">
      <div class="room-len">当前房间在线人数：{{roomLen}}</div>
      <div class="message-box" id="scroll-box">
        <div class="scroll_content">
          <ul>
            <li v-for="(item,index) in records" :key="index">
              <p class="time">
                <span>{{ item.time }}</span>
              </p>
              <div :class="{ self: item.self }" class>
                <div class="nickname">{{ item.nickname }}</div>
                <img src="~/assets/avatar.png" class="avatar" width="30" height="30" />
                <div class="text">
                  <span v-html="item.content" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="input-box">
        <div class="chat_edit">
          <div class="chat_edit_input">
            <div>
              <textarea v-model="content" :rows="6" placeholder="请输入内容" @keyup.enter="sendReply" />
            </div>
          </div>
          <div class="chat_edit_footer">按Enter发送，Ctrl+Enter换行</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      inputDisplay: true,
      messageDisplay: false,
      nickname: "",
      sender: "",
      records: "",
      loading: false,
      more_text_display: true,
      avatar: "~/assets/avatar.png",
      roomLen:0
    };
  },
  methods: {
    setName() {
      this.inputDisplay = false;
      this.messageDisplay = true;
      let sender = window.btoa(window.encodeURIComponent(this.nickname));
      localStorage.setItem("sender", sender);
      this.sender = sender;
      this.$socket.emit("enterRoom", { id: sender });
    },
    sendReply() {
      let isSeensitive = this.$myInjectedFunction(this.content)
      if(isSeensitive){
         this.$message.warning('输入内容包含敏感词');
         return false;
      }
      this.$socket.emit("sendToRoom", {
        uid: this.sender,
        content: window.btoa(window.encodeURIComponent(this.content)),
      });
      this.content = "";
    },
  },
  mounted() {
    let sender = localStorage.getItem("sender");
    console.log("进入聊天室", sender);
    if (sender) {
      this.inputDisplay = false;
      this.messageDisplay = true;
      this.sender = sender;
      this.$socket.emit("enterRoom", { id: sender });
    }
    
  },

  sockets: {
    broadcast: function (msg) {
      let item = {};
      if (msg.Sender == this.sender) {
        item.self = true;
      } else {
        item.self = false;
      }
      item.id = msg.Id;
      item.content = msg.Content;
      item.time = msg.Time;
      item.sender = msg.Sender;
      item.nickname = window.decodeURIComponent(window.atob(item.sender));
      this.records.push(item);
      setTimeout(() => {
        let oContent = document.getElementById("scroll-box");
        oContent.scrollTop = oContent.scrollHeight;
      }, 0);
    },
    initRoomData: function (msg) {
      if (msg.length > 0) {
        msg.forEach((element) => {
          if (element.sender == this.sender) {
            element.self = true;
          } else {
            element.self = false;
          }
          element.nickname = window.decodeURIComponent(
            window.atob(element.sender)
          );
          element.content = window.decodeURIComponent(
            window.atob(element.content)
          );
        });
      }
     
      this.records = msg;
      setTimeout(() => {
        let oContent = document.getElementById("scroll-box");
       
        oContent.scrollTop = oContent.scrollHeight;
      }, 0);
    },
    roomLen:function(msg){
      this.roomLen = msg
    }
    
  },
};
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.main {
  padding: 10px;
  margin-top: 50px;
  min-height: 800px;
  border: 1px solid #ccc;
  background:#f5f5f5;
}
.message-box {
  height: 600px;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(144, 147, 153, 0.5);
  }
  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background: transparent;
  }
  
}


.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.chat_edit_items {
  height: 40px;
  padding: 0 20px;
}
.chat_edit_input {
  height: 120px;

  overflow: hidden;
}
.chat_edit_footer {
  height: 30px;
  padding: 0 20px;
  text-align: right;
  color: #bcbcbc;
}
textarea {
  padding: 10px;
  height: 60%;
  width: 100%;
  border: none;
  outline: none;
  font-family: "Micrsofot Yahei";
  resize: none;
  background: #f5f5f5;
}
.input-box {
  width: 100%;
  margin-top: 10px;
  border-top: 1px solid #dcdfe6;
}
.input-name {
  margin-top: 200px;
  max-width: 300px;
  margin: 200px auto 0 auto;
}
.scroll_content {
  padding: 10px 15px;
  //overflow-y: scroll;
  ul {
    padding: 20px 0 0 0;
    li {
      margin-bottom: 15px;
      list-style-type: none;
    }
  }
  .more {
    text-align: center;
    color: #409eff;
    font-size: 12px;
  }
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: "calc(100% - 40px)";
    min-height: 30px;
    line-height: 2.5;
    font-size: 14px;
    text-align: left;
    word-break: break-all;
    background-color: #fff;
    border-radius: 4px;

    &:before {
      content: " ";
      position: absolute;
      top: 9px;
      right: 100%;
      border: 6px solid transparent;
      border-right-color: #fff;
    }
  }
  .nickname {
    padding: 5px 40px 5px 40px;
    font-size: 12px;
    color: #777;
  }
  .self {
    text-align: right;
    .nickanme {
      padding-right: 40px;
    }
    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text {
      background-color: #b2e281;

      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
.room-len{
  height:30px;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
}
</style>
