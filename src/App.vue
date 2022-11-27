<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.center-container {
  position: fixed;
  width: 100%;
  height: 100%;
}

.center-content {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  width: 30%;
  margin: 0 auto;
  padding: 10px 20px 10px 20px;
}

.center-content:hover {
  box-shadow: 0 0 100px 10px black;
}

@media (max-width: 1200px) {
  .center-content {
    width: 60%;
  }
}

@media (max-width: 700px) {
  .center-content {
    width: 80%;
  }
}

</style>
