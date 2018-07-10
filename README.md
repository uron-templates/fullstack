# uron-template-person

## 使用指南
要跑起来一个项目，需要两步：
- 初始化项目
- 修改配置文件

### 初始化项目
uron-init <template-name> [project-name]

如下语句，使用 person 模板初始化一个叫 my-project 的项目
```
uron init person my-project
```

### 修改配置文件
#### 如果需要使用数据库，则需要配置数据库 host 、用户名、密码等，步骤如下
修改项目根目录下的 `.env `文件中的 `db_host `为数据库地址，`db_database` 为要操作的数据库表，`db_user` 和 `db_password` 为数据库的用户名和密码

#### 如果需要使用 graph，用 `src/server/schema/fruit_back.sql` 初始化好数据库之后，通过`http://localhost:8000/graphiql`就可以查看 graphql 的例子。

#### 修改缓存时间
本项目对静态文件托管默认开启了缓存，缓存时间为 `1000 * 60 * 60 * 1 ms`；也默认开启了 `Conditional GET`，即通过 etag 确实是否资源在上次请求过之后发生了改变，如果发生了，则返回`status:304`。要修该这部分，需要到`src/server/app.js`中进行修改。该文件是 server 端的入口文件。

#### 别名
本项目可以设置别名，默认的别名在 `.babelrc` 中的 `module-resolver -> alias` 中，如需增加或修改别名，可在该文件中进行修改。但务必将 jsconfig.json 中对应别名的地址也进行修改，该文件是 vscode 的配置文件。根据该配置，vscode 可以对别名引用的模块进行智能提示。

### 运行项目
- 在根目录下运行`npm run dev`就可以将项目跑起来，默认端口为8000.可以通过环境变量`PORT`进行修改。
- 本项目配置了 vscode 的调试，在 vscode 的调试界面选择`babel-node debug`,按`开始调试`按钮就可以以对项目进行调试

### 查看效果
本项目有三种特性：静态文件托管、特殊路径需要 basic auth 认证、集成了 graphql。对这三个特性分别进行验证。

注：要graphql 功能，需要在初始化项目的时候选择启用 graphql 功能。

- 静态文件托管
>> 访问地址`http://localhost:8000`,能看到返回的文件是{{ staticRootDir }}下的文件。如果没有带具体文件名，会默认返回当前文件夹下的 index.html 页面。说明 **静态文件托管** 功能正常。

- basic auth 认证
>> 访问地址`http://localhost:8000/private`,能看到返回的文件是{{ staticRootDir }}/private 下的文件。如果没有带具体文件名，会默认返回当前文件夹下的 index.html 页面。说明 **basic auth认证** 功能正常。

- graphql 功能
>> 访问地址`http://localhost:8000/graphiql` (别遗漏了 url 中的`i`字母))，能打开 graphiql 页面，并输入
```
query{
    fruits{
        id
        name
    }
}
```
能返回数据库中 fruits 的 id 和 name 数据，则说明 graphql 功能正常。

<hr >

## 项目结构