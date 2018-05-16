# refire-app

> Opinionated wrapper for quick prototyping with React, Redux and Firebase

## Quick start

1. Install [create-react-app](https://github.com/facebookincubator/create-react-app) with `npm install -g create-react-app`
2. Generate your React app, e.g. `create-react-app my-app` and `cd my-app`
3. Install `refire-app` with `npm install -S refire-app`
4. Paste following code over previous content in `src/index.js` and run the app with `npm start`

```js
import React from 'react'
import refireApp, { IndexRoute, Route, Link, bindings, styles } from 'refire-app'

const nameStyles = { textTransform: "capitalize" }

const App = (props) => (<div>{props.children}</div>)

const Dinosaurs = styles(
  { name: nameStyles, container: { listStyle: "none" } },
  bindings([ "dinosaurs" ])(({ dinosaurs: dinos, styles }) => {
    if (!dinos) return (<div>Loading...</div>)
    const { value: dinosaurs = [] } = dinos || {}
    return (
      <div>
        <h1>Dinosaurs</h1>
        <ul className={styles.container}>
        {
          dinosaurs.map(({key}) => (
            <li key={key} className={styles.name}>
              <Link to={`/${key}`}>{key}</Link>
            </li>
          ))
        }
        </ul>
      </div>
    )
  })
)

const Dinosaur = styles(
  { name: nameStyles },
  bindings([ "dinosaur", "score" ])(({ dinosaur: dino, score: dinoScore, styles }) => {
    if (!dino || !dinoScore) return (<div>Loading...</div>)
    const { value: dinosaur = {}, key: name } = dino || {}
    const { value: score = {} } = dinoScore || {}
    return (
      <div>
        <h1 className={styles.name}>{name}</h1>
        <h2>{score} points</h2>
        <ul>
          <li>Order: {dinosaur.order}</li>
          <li>Appeared: {dinosaur.appeared} years ago</li>
          <li>Vanished: {dinosaur.vanished} years ago</li>
          <li>Height: {dinosaur.height} m</li>
          <li>Length: {dinosaur.length} m</li>
          <li>Weight: {dinosaur.weight} kg</li>
        </ul>
        <Link to="/">Back to dinosaurs list</Link>
      </div>
    )
  })
)

const apiKey = 'your-api-key-from-firebase-console-not-needed-in-this-example'
const projectId = 'dinosaur-facts'

const firebaseBindings = {
  "dinosaurs": { type: "Array", path: "dinosaurs" },
  "dinosaur": {
    type: "Object",
    path: (state) => {
      const { dinosaurId } = state.routing.params
      return dinosaurId ? `dinosaurs/${dinosaurId}` : null
    }
  },
  "score": {
    type: "Object",
    path: (state) => {
      const { dinosaurId } = state.routing.params
      return dinosaurId ? `scores/${dinosaurId}` : null
    }
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Dinosaurs} />
    <Route path=":dinosaurId" component={Dinosaur} />
  </Route>
)

refireApp({
  apiKey,
  projectId,
  bindings: firebaseBindings,
  routes,
  elementId: "root"
})
```

## refireApp(options={})

Initializes redux, react-router, react-router-redux-params and refire.

### options

**apiKey** *Firebase api key*

**projectId** *Firebase project id*

**bindings** *Refire bindings*

**routes** *React Router routes*

**reducers = {}** *Additional redux reducers*

**middleware = []** *Additional redux middleware*

**history = browserHistory** *Which type of history react-router should use*

**elementId = 'app'** *DOM element id for your app*

## Component wrappers

### bindings([])

```js
import React, { Component } from 'react'
import { bindings } from 'refire-app'
class YourComponent extends Component {
  render() {
    // board & boardThreads data available as props, re-rendered automatically as data changes
  }
}
export default bindings(["board", "boardThreads"])(YourComponent)
```

### styles({})

Wrapper for [react-free-style](https://github.com/blakeembrey/react-free-style), your styles will be automatically inserted to a style tag at app's root level with unique classnames.

Styles can be defined as plain JS objects, this means you can use libraries like [color](https://github.com/Qix-/color) or [prefix-lite](https://github.com/namuol/prefix-lite) to enhance your styles.

```js
import React, { Component } from 'react'
import { styles } from 'refire-app'
class YourComponent extends Component {
  render() {
    const { styles } = this.props
    return (
      <div className={styles.container}>
        ...
      </div>
    )
  }
}
export default styles({
  container: {
    padding: "30px 0",
    background: "#000",
    color: "#fff"
  }
}, YourComponent)
```

You can also allow your components to be easily extended by users, any component wrapped with `styles` will accept `styles` prop to be passed in and those styles will be merged with existing styles.

```js
import React, { Component } from 'react'

class UserComponent extends Component {
  render() {
    // we want more top & bottom padding, other container styles will stay as they were defined in YourComponent
    return (
      <div>
        <YourComponent styles={{container: {padding: "50px 0"} }} />
      </div>
    )
  }
}

export default UserComponent
```

## Exports

### [refire](https://github.com/hoppula/refire)
* firebaseToProps
* FirebaseLogin
* FirebaseLogout
* FirebaseOAuth
* FirebaseRegistration
* FirebaseResetPassword
* FirebaseWrite
* [firebase](https://www.npmjs.com/package/firebase)
* USER_AUTHENTICATED
* USER_UNAUTHENTICATED

### [react-redux](https://github.com/reactjs/react-redux)
* connect

### [redux](https://github.com/reactjs/redux)
* bindActionCreators

### [react-router](https://github.com/reactjs/react-router)
* Link
* IndexLink
* IndexRedirect
* IndexRoute
* Redirect
* Route
* browserHistory
* hashHistory

### [react-router-redux-params](https://github.com/hoppula/react-router-redux-params)
* routeActions

### [react-free-style](https://github.com/blakeembrey/react-free-style)
* create (as createStyles)

## Real world example

[refire-forum](https://github.com/hoppula/refire-forum) is built with refire-app.

[Live demo](https://refire.firebaseapp.com/)

## License

MIT
