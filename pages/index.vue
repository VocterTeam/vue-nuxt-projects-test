<template>
  <section class="container">
    <h1 class="page-title">Homepage</h1>

    <button type="button" @click="logout">Logout</button>

    <ul class="projects" v-if="projects && projects.length">
      <li
        class="project-item"
        v-for="(project, index) in projects"
        @click="openEditModal(project, index)"
        :key="project.id">
        <!-- logo -->
        <div class="project-item__block project-item__block--logo">
          <img :src="project.logo" class="logo" :alt="project.name" v-if="project.logo" width="40px" height="40px" />
          <div class="default-avatar" v-else>{{project.name ? project.name.charAt(0) : ''}}</div>
        </div>
        
        <!-- name -->
        <div class="project-item__block project-item__block--name">
          {{project.name}}
        </div>

        <!-- status -->
        <div class="project-item__block project-item__block--status">
          <div class="project-status" :class="{'active': project.is_active, 'inactive': !project.is_active}">{{ project.is_active ? 'Active' : 'Inactive'}}</div>

          <div class="users-status">
            <template v-if="project.users && project.users.length">
              {{project.users}}
            </template>
            <template v-else>No users</template>
          </div>
        </div>

        <!-- stats -->
        <div class="project-item__block project-item__block--stats">
          <ul class="stats-list">
            <li class="stats-row">
              <span class="stats-row__title">time this week</span>
                <span class="stats-row__value">{{project.spent_time_week}}</span>
              </li>
            <li class="stats-row">
              <span class="stats-row__title">time this month</span>
                <span class="stats-row__value">{{project.spent_time_month}}</span>
              </li>
            <li class="stats-row">
              <span class="stats-row__title">total</span>
                <span class="stats-row__value">{{project.spent_time_all}}</span>
              </li>
          </ul>
        </div>
      </li>
    </ul>
  
    <!-- edit modal -->
    <div class="edit-modal" v-if="updateProjectModalSettings.show">
      <div class="edit-modal__inner">
        <form action="#" id="edit-project-form" class="edit-project-form">
          <div class="edit-fields">
            <label for="edit-name" class="edit-form-label">Name</label>
            <input
              ref="edit-name-input"
              class="form-field"
              type="text"
              id="edit-name"
              name="name"
              @change="editName"
              :value="updateProjectModalSettings.project.name" />
          </div>

          <div class="controls">
            <button type="button" class="controls-btn controls-btn--back" @click="closeEditModal">Back</button>
            <button type="button" class="controls-btn controls-btn--save" @click="editProject(updateProjectModalSettings.project, updateProjectModalSettings.index)">Save</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
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

  data () {
    return {
      updateProjectModalSettings: {
        show: false,
        project: null,
        index: undefined,
        data: {}
      }
    }
  },

  methods: {
    async openEditModal (project, index) {
      this.updateProjectModalSettings.project = project
      this.updateProjectModalSettings.index = index

      try {
        let response = await axios.get(`https://api.quwi.com/v2/projects-manage/${project.id}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth ? this.$store.state.auth.accessToken : ''}`
          }
        })

        this.updateProjectModalSettings.data = response.data.project
        this.$nextTick(() => {
          this.updateProjectModalSettings.show = true
        })
      } catch (e) {
        console.log('error', e)
      }
    },

    editName ($event) {
      let value = $event.currentTarget.value

      if (value) {
        this.$set(this.updateProjectModalSettings.data, 'name', value)
      }
    },

    /**
     * method fires when the user clicks on edit project
     * @param  {Object} project - current object the user clicked on
     * @param  {number} index - index of the current project in the array of projects
    */
    async editProject (project, index) {
      let updatedName = this.updateProjectModalSettings.data.name

      try {
        let response = await axios.put(`https://api.quwi.com/v2/projects-manage/update?id=${project.id}`, {name: updatedName}, {
          headers: {
            Authorization: `Bearer ${this.$store.state.auth ? this.$store.state.auth.accessToken : ''}`
          }
        })

        Object.assign(this.projects[index], response.data.project)
        this.$nextTick(() => this.updateProjectModalSettings.show = false)
      } catch(e) {
        console.log('test', e)
      }
    },

    closeEditModal () {
      this.updateProjectModalSettings.show = false
    },

    logout () {
      this.$store.commit('setAuth', null)
      Cookie.remove('auth')
      this.$router.push('/login')
    }
  }
}

</script>

<style scoped>
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

  .projects {
    list-style: none;
    padding-left: 0;
    margin-top: 20px;
    max-width: 600px;
    margin: 0 auto;
  }

  .project-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    cursor: pointer;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #dedede;
    padding: 18px 20px 20px 25px;
  }

  .project-item:hover {
    background: #ececec;
  }

  .project-item__block {
    flex: 1;
    margin-right: 10px;
  }

  .project-item__block:last-of-type {
    margin-right: 0;
  }

  .project-item__block--logo {
    max-width: 65px;
  }

  .project-item__block--name {
    flex: 2;
  }

  .project-item__block--status {
    text-align: center;
  }

  .project-item__block--stats {
    flex: 2;
    margin-left: 32px;
    min-width: 162px;
  }

  .default-avatar {
    display: inline-flex;
    height: 40px;
    width: 40px;
    font-size: 17px;
    background: #ed874f;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-transform: uppercase;
  }

  .project-status.active {
    color: green;
  }

  .project-status.inactive {
    color: #d83c3c;
  }
  
  .edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .edit-modal__inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    padding: 20px;
    color: #000;
    background: #fff;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.44);
    transform: translate(-50%, -50%);
  }

  .form-field {
    padding: 10px;
  }

  .edit-form-label {
    display: inline-block;
    margin-right: 25px;
  }

  .edit-fields {
    margin-bottom: 25px;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .controls-btn {
    margin-left: 15px;
    min-width: 90px;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    height: 34px;
    padding: 0 15px;
    border-radius: 4px;
  }

  .controls-btn:hover {
      opacity: .7;
  }

  .controls-btn--back {
    background-color: #cecece;
    border: 1px solid #bebebe;
    text-shadow: 1px 1px 0 #ccc;
  }

  .controls-btn--save {
    margin-right: 0;
    color: #fff;
    background: #395378;
  }

  .stats-list {
    padding-left: 0;
  }

  .stats-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .logo {
    object-fit: cover;
  }
</style>
