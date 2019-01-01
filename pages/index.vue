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
              {{project.users.length}}
            </template>
            <template v-else>No users</template>
          </div>
        </div>

        <!-- stats -->
        <div class="project-item__block project-item__block--stats">
          <ul class="stats-list">
            <li class="stats-row">
              <span class="stats-row__title">time this week</span>
                <span class="stats-row__value">{{project.spent_time_week ? project.spent_time_week : 0  | formattedDate}}</span>
              </li>
            <li class="stats-row">
              <span class="stats-row__title">this month</span>
                <span class="stats-row__value">{{project.spent_time_month ? project.spent_time_month : 0  | formattedDate}}</span>
              </li>
            <li class="stats-row">
              <span class="stats-row__title">total</span>
                <span class="stats-row__value">{{project.spent_time_all ? project.spent_time_all : 0 | formattedDate}}</span>
              </li>
          </ul>
        </div>
      </li>
    </ul>
  
    <!-- edit modal -->
    <edit-modal
      :settings="updateProjectModalSettings"
      v-if="updateProjectModalSettings.show"
      @save="onEditProject"
      @close="closeEditModal" />
  </section>
</template>

<script>
import moment from 'moment'
const Cookie = process.client ? require('js-cookie') : undefined
import axios from 'axios'
import EditModal from '@/components/EditModal.vue'

export default {
  middleware: 'authenticated',

  components: {
    EditModal
  },

  filters: {
    formattedDate (timeValue = 0) {
      return moment(timeValue, 'HH').format('HH:mm:ss')
    }
  },

  data () {
    return {
      projects: [],
      updateProjectModalSettings: {
        show: false,
        project: null,
        index: undefined,
        data: {}
      }
    }
  },

  /**
   * asyncData taken from the api
   * @param  {Object} options.store - app's store
   * @return {Object}               - Object which consists of the array of projects
   */
  async asyncData ({store}) {
    let response = await axios.get('https://api.quwi.com/v2/projects', {
      headers: {
        Authorization: `Bearer ${store.state.auth ? store.state.auth.accessToken : ''}`
      }
    })

    return {projects: response.data.projects}
  },

  methods: {
    /**
     * opens edit modal, sets the proper data taken from the api
     * @param  {Object} project - project which needs to be updated
     * @param  {number} index - project's number
    */
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

    /**
     * callback fires on save event from edit-modal component
     * @param  {Object} options.project - updated project
     * @param  {number} options.index - updated project's index
    */
    onEditProject ({project, index}) {
      Object.assign(this.projects[index], project)

      this.$nextTick(() => this.updateProjectModalSettings.show = false)
    },

    /**
     * close the edit modal
    */
    closeEditModal () {
      this.updateProjectModalSettings.show = false
    },

    /**
     * logout from app
    */
    logout () {
      this.$store.commit('setAuth', null)
      Cookie.remove('auth')
      this.$router.push('/login')
    }
  },
}

</script>

<style>
  body {
    background-color: #F4F4F4;
  }
</style>

<style scoped>
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
    margin-bottom: 6px;
    font-size: .9em;
  }

  .project-item:last-of-type {
    margin-bottom: 0;
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
    text-align: center;
    margin-right: 0;
  }

  .project-item__block--name {
    flex: 2;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .project-item__block--status {
    flex: 2;
    text-align: center;
    font-weight: 700;
    margin-right: 0;
  }

  .project-item__block--stats {
    flex: 2;
    margin-left: 32px;
    min-width: 162px;
    max-width: 162px;
    white-space: nowrap;
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

  .stats-list {
    padding-left: 0;
  }

  .stats-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .stats-row__title {
    font-size: 12.6px;
  }

  .stats-row__value {
    font-weight: 700;
  }

  .logo {
    object-fit: cover;
  }
</style>
