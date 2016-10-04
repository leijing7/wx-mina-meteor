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
    todos: []
  },
  onLoad: function () {
    const Asteroid = asteroid.createClass()
    const client = new Asteroid({
      endpoint: "ws://localhost:3000/websocket"
    });
    client.subscribe("tasks");
    client.ddp.on("added", ({collection, id, fields}) => {
      const contains = underscore.find(todoArr, (td) => id === td.id)
      if (!contains){
        fields.id = id
        todoArr.push(fields)
      }
      this.setData({
        todos: todoArr.sort((a,b) => b.createdAt.$date - a.createdAt.$date)
      })
    });
    client.ddp.on("changed", ({collection, id, fields}) => {
      const idx = underscore.findIndex(todoArr, (td) => id === td.id)
      if (idx>=0){
        todoArr[idx].checked = fields.checked
      }
      this.setData({
        todos: todoArr.sort((a,b) => b.createdAt.$date - a.createdAt.$date)
      })
    });
    client.ddp.on("removed", ({collection, id}) => {
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
    const client = new Asteroid({
      endpoint: "ws://localhost:3000/websocket"
    });
    client.call("tasks.setChecked", diffId, !diffItem.checked)
      .then(result => {
          console.log("Success");
      })
      .catch(error => {
          console.error(error);
      });
  }
})