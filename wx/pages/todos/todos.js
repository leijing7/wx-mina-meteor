require('../../libs/asteroidAPI.js')
require('../../libs/underscoreAPI.js')
let todoArr = []

function findDiffArr(a1, a2) {
  if (a1.length > a2.length)
    return underscore.difference(a1, a2)
  else 
    return underscore.difference(a2, a1)
}

Page({
  data: {
    todos: [],
    client: null,
    inputValue: '',
    isInserting: false
  },
  onLoad: function () {
    const Asteroid = asteroid.createClass()
    this.data.client = new Asteroid({
      endpoint: "ws://localhost:3000/websocket"
    });
    this.data.client.subscribe("tasks");
    this.data.client.ddp.on("added", ({collection, id, fields}) => {
      const contains = underscore.find(todoArr, (td) => id === td.id)
      if (!contains){
        fields.id = id
        todoArr.push(fields)
      }
      this.setData({
        todos: todoArr.sort((a,b) => b.createdAt.$date - a.createdAt.$date)
      })
    });
    this.data.client.ddp.on("changed", ({collection, id, fields}) => {
      const idx = underscore.findIndex(todoArr, (td) => id === td.id)
      if (idx>=0){
        todoArr[idx].checked = fields.checked
      }
      this.setData({
        todos: todoArr.sort((a,b) => b.createdAt.$date - a.createdAt.$date)
      })
    });
    this.data.client.ddp.on("removed", ({collection, id}) => {
      const idx = underscore.findIndex(todoArr, (td) => id === td.id)
      if (idx>=0){
        todoArr.splice(idx, 1)
      }
      this.setData({
        todos: todoArr.sort((a,b) => b.createdAt.$date - a.createdAt.$date)
      })
    });
  },
  checkboxChange: function(e) {
    const checkedArr = todoArr.filter((t) => t.checked)
    let diffId = findDiffArr(underscore.pluck(checkedArr, 'id'), e.detail.value)[0]
    const diffItem = todoArr.find(t => t.id == diffId)
    const Asteroid = asteroid.createClass()
    
    this.data.client.call("tasks.setChecked", diffId, !diffItem.checked)
      .then(result => {
          console.log("Success");
      })
      .catch(error => {
          console.error(error);
      });
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindAddBtnTap: function() {
    //sometime this'd be called multi times at one tap
    if(!underscore.pluck(this.data.todos, 'text').includes(this.data.inputValue) && !this.data.isInserting){
      console.log(this.data.inputValue)
      this.data.isInserting = true
      this.data.client.call("tasks.insert", this.data.inputValue)
        .then(result => {
          console.log("Success");
          this.data.isInserting = false
        })
        .catch(error => {
          console.error(error);
          this.data.isInserting = false
        });
    } else {
      console.log("can not insert same text")
    }
  },
})