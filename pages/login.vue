<template>
	<section class="container">
		<h1 class="page-title">Login</h1>

		<form action="#" id="login-form" class="login-form">
			<input type="email" name="email" class="form-field" v-model="formData.email" placeholder="Email" />
			<input type="password" name="password" class="form-field" v-model="formData.password" placeholder="Password" />

			<button type="submit" class="form-submit" @click.prevent="login">Login</button>
		</form>

		<!-- show apiErrors -->
  	<ul class="api-errors" v-if="hasApiErrors">
    	<li v-for="error in apiErrors">
    		{{error}}
    	</li>
    </ul>

	</section>
</template>

<script>
export default {
	data () {
		return {
			formData: {
				email: '',
				password: ''
			},
			apiErrors: {}
		}
	},

	watch: {
		formData: {
			handler (n) {
				this.setApiErrors({})
			},
			deep: true
		}
	},

	computed: {
		hasApiErrors () {
	    for (var prop in this.apiErrors) {
	        if (this.apiErrors.hasOwnProperty(prop)) {
	         	return true;
	        }
	    }

    	return false;
		},
	},

	methods: {
		/**
		* sends request to login into the app
		*/
		async login () {
	    try {
	      let response = await this.$axios.post('https://api.quwi.com/v2/auth/login', this.formData)
	    	
	      // this.setAuthToken(response.data.token)
	      this.homePageRedirect()
	    } catch (e) {
	      if (e && e.response && e.response.data) {
					if (e.response.data.first_errors) {
						this.setApiErrors(e.response.data.first_errors)
					}
				}
	    }
	  },

	  /**
	  * set Api Errors for a given errors object taken from API
	  * @param {Object} errors errors from API
	  */
	  setApiErrors (errors) {
	  	this.apiErrors = errors
	  },

	  homePageRedirect () {
	  	this.$router.push('/')
	  }
	}
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

  .login-form {
  	max-width: 350px;
  }

  .form-field {
  	width: 100%;
  	margin-bottom: 15px;
  	padding: 10px;
  }

  .form-submit {
  	cursor: pointer;
  	padding: 12px 40px;
  	border-radius: 6px;
  	border: none;
  	color: #fff;
  	text-transform: uppercase;
  	background-color: #395378;
  }

  .api-errors {
  	padding-left: 0;
  	list-style: none;
  	margin-top: 15px;
  	color: #d83c3c;
  }
</style>