<template>
  <section class="container">
    <h1 class="page-title">Homepage</h1>

    <ul class="projects" v-if="projects && projects.length">
      <li v-for="(project, index) in projects">
        {{project}}
        <button type="button" @click="editProject(project, index)">Edit Project</button>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'authenticated',

  async asyncData ({ store }) {
    let response = await axios.get('https://api.quwi.com/v2/projects', {
      headers: {
        Authorization: `Bearer ${store.state.auth ? store.state.auth.accessToken : ''}`
      }
    })

    return {projects: response.data.projects}
  },
}

</script>

<style>
  body {
    background-color: #F4F4F4;
  }

  .container {
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
  }

  .page-title {
    text-transform: uppercase;
    margin-bottom: 15px;
  }
</style>
