1. simple-todos-react 是一个 meteor 的 React todo list 例子。我有一点改动，主要是在插入时需要用户登录改为了不用登录就可以添加新任务，这样小程序就可以添加新任务而不用登录。

把 simple-todos-react/imports/api/tasks.js 里的 Meteor.methods 插入函数改为如下

```
'tasks.insert'(text) {
  check(text, String);

  // Make sure the user is logged in before inserting a task
  // if (! this.userId) {
  //   throw new Meteor.Error('not-authorized');
  // }

  const username = Meteor.users.findOne(this.userId) ? Meteor.users.findOne(this.userId).username : "anonymous"

  Tasks.insert({
    text,
    createdAt: new Date(),
    owner: this.userId,
    username: username,
  });
```

这样才能在小程序端插入新的事项。

2. webpacks 是二次打包代码和已经打包好的

3. wx 是微信小程序代码


![微信小程序 Reactive UI](https://github.com/leijing7/wx-mina-meteor/blob/master/static/mina.gif)
