<template>
  <div
    :style="{
      background: `url(${require('@/assets/img/bg.jpg')})`,
      minHeight: '100vh',
      'background-size': 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }"
    class="main"
  >
    <div class="container">
      <div>
        <div>
          <a href="https://osg.uz/" title="Online Service Group">
            <img src="@/assets/img/logo.png" />
          </a>
        </div>
        <div class="container">
          <div class="card" />
          <div class="card">
            <h1 class="title"><span>Вход в панель</span> OSG CMS</h1>
            <form @submit.prevent="submit">
              <div class="input-container">
                <input
                  ref="usernameInput"
                  v-model="form.username"
                  required
                  type="text"
                />
                <label for="Username">Пользователь</label>
                <div ref="username" class="bar error-text" />
              </div>
              <div class="input-container">
                <input
                  v-model="form.password"
                  autocomplete="on"
                  required
                  type="password"
                />
                <label for="Password">Пароль</label>
                <div ref="password" class="bar error-text" />
              </div>
              <div class="button-container">
                <button
                  :disabled="loading"
                  class="login-btn"
                  style="background-color: rgb(229, 2, 62); min-height: 70px"
                >
                  <span style="color: rgb(255, 255, 255)">{{
                    loading ? "Загрузка..." : "Вход в систему"
                  }}</span>
                </button>
              </div>
            </form>
          </div>
          <div class="copy">
            <a href="https://osg.uz/" title="Online Service Group">
              <p>OOO "Online Service Group"</p>
            </a>
            <p>© 2020. Все права защищены.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      username: "",
      password: ""
    },
    loading: false
  }),
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.usernameInput) {
        this.$refs.usernameInput.focus()
      }
    })
  },
  methods: {
    validation() {
      let isValid = true
      this.$refs.username.innerHTML = ""
      this.$refs.password.innerHTML = ""

      if (!this.form.username) {
        this.$refs.username.innerHTML = "Введите логин"
        isValid = false
      }

      if (!this.form.password) {
        this.$refs.password.innerHTML = "Введите пароль для входа"
        isValid = false
      }

      return isValid
    },
    submit() {
      if (!this.validation()) {
        return
      }

      this.loading = true
      this.$api
        .post("/auth/token/", this.form)
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data);
            if (res.data.access) {
              this.parseJwt(res.data.access).user_role != "User" &&
                this.$store.commit("setToken", res.data.access)
              this.parseJwt(res.data.access).user_role != "User" &&
                this.$store.commit(
                  "setRole",
                  this.parseJwt(res.data.access).user_role
                )
              this.parseJwt(res.data.access).user_role != "User"
                ? this.$router.push("/")
                : this.$router.go()
            }
          }

          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    parseJwt(token) {
      var base64Url = token.split(".")[1]
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )

      return JSON.parse(jsonPayload)
    }
  }
}
</script>

<style scoped>
body {
  background: #e9e9e9;
  color: #666666;
  font-family: "RobotoDraft", "Roboto", sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.copy {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  color: #2f2f2f;
}

.copy a {
  text-decoration: none;
  color: #2f2f2f;
}

/* Pen Title */
.pen-title {
  padding: 50px 0;
  text-align: center;
  letter-spacing: 2px;
}

.pen-title h1 {
  margin: 0 0 20px;
  font-size: 48px;
  font-weight: 300;
}

.pen-title span {
  font-size: 12px;
}

.pen-title span .fa {
  color: #ed2553;
}

.pen-title span a {
  color: #ed2553;
  font-weight: 600;
  text-decoration: none;
}

/* Rerun */
.rerun {
  margin: 115px 0 0;
  text-align: center;
}

.rerun a {
  cursor: pointer;
  display: inline-block;
  /*background: #ed2553;*/
  border-radius: 3px;
  /*box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);*/
  padding: 10px 20px;
  color: #ffffff;
  text-decoration: none;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

/* Scroll To Bottom */
#codepen,
#portfolio {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #363636;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  color: #ffffff;
  text-align: center;
}

#codepen i,
#portfolio i {
  line-height: 56px;
}

#codepen:hover,
#portfolio:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

/* CodePen */
#portfolio {
  bottom: 96px;
  right: 36px;
  background: #ed2553;
  width: 44px;
  height: 44px;
  -webkit-animation: buttonFadeInUp 1s ease;
  animation: buttonFadeInUp 1s ease;
}

#portfolio i {
  line-height: 44px;
}

p {
  margin-bottom: 0;
}

/* Container */
.container {
  position: relative;
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
}

.container.active .card:first-child {
  background: #f2f2f2;
  margin: 0 15px;
}

.container.active .card:nth-child(2) {
  background: #fafafa;
  margin: 0 10px;
}

.container.active .card.alt {
  top: 20px;
  right: 0;
  width: 100%;
  min-width: 100%;
  height: auto;
  border-radius: 5px;
  padding: 60px 0 40px;
  overflow: hidden;
}

.container.active .card.alt .toggle {
  position: absolute;
  top: 40px;
  right: -70px;
  box-shadow: none;
  -webkit-transform: scale(10);
  transform: scale(10);
  -webkit-transition: -webkit-transform 0.3s ease;
  transition: -webkit-transform 0.3s ease;
  transition: transform 0.3s ease;
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
}

.container.active .card.alt .toggle:before {
  content: "";
}

.container.active .card.alt .title,
.container.active .card.alt .input-container,
.container.active .card.alt .button-container {
  left: 0;
  opacity: 1;
  visibility: visible;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

.container.active .card.alt .title {
  -webkit-transition-delay: 0.3s;
  transition-delay: 0.3s;
}

.container.active .card.alt .input-container {
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
}

.container.active .card.alt .input-container:nth-child(2) {
  -webkit-transition-delay: 0.5s;
  transition-delay: 0.5s;
}

.container.active .card.alt .input-container:nth-child(3) {
  -webkit-transition-delay: 0.6s;
  transition-delay: 0.6s;
}

.container.active .card.alt .button-container {
  -webkit-transition-delay: 0.7s;
  transition-delay: 0.7s;
}

/* Card */
.card {
  position: relative;
  background: #ffffff;
  border-radius: 5px;
  padding: 60px 0 40px 0;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  /* Title */
  /* Inputs */
  /* Button */
  /* Footer */
  /* Alt Card */
}

.card:first-child {
  background: #f0f1f3;
  height: 10px;
  border-radius: 5px 5px 0 0;
  margin: 0 10px;
  padding: 0;
}

.card .title {
  position: relative;
  z-index: 1;
  border-left: 5px solid #ed2553;
  margin: 0 0 35px;
  padding: 10px 0 10px 50px;
  color: #ed2553;
  font-size: 28px;
  font-weight: 600;
  text-transform: uppercase;
}

.title span {
  color: #000;
}

.card .input-container {
  position: relative;
  margin: 0 60px 50px;
}

.card .input-container input {
  outline: none;
  z-index: 1;
  position: relative;
  background: none;
  width: 100%;
  height: 60px;
  border: 0;
  color: #212121;
  font-size: 24px;
  font-weight: 400;
  border-bottom: 1px solid #ddd;
}

.card .input-container input:focus ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
  transform: translate(-12%, -50%) scale(0.75);
}

.card .input-container input:focus ~ .bar:before,
.card .input-container input:focus ~ .bar:after {
  width: 50%;
}

.card .input-container input:valid ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
  transform: translate(-12%, -50%) scale(0.75);
}

.card .input-container label {
  position: absolute;
  top: 0;
  left: 0;
  color: #757575;
  font-size: 24px;
  font-weight: 300;
  line-height: 60px;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}

.card .input-container .bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background: #757575;
  width: 100%;
  height: 1px;
}

.card .input-container .bar:before,
.card .input-container .bar:after {
  content: "";
  position: absolute;
  background: #ed2553;
  width: 0;
  height: 2px;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}

.card .input-container .bar:before {
  left: 50%;
}

.card .input-container .bar:after {
  right: 50%;
}

.card .button-container {
  margin: 0 60px;
  text-align: center;
}

.card .button-container button {
  outline: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
  background: 0;
  width: 240px;
  border: 2px solid #e3e3e3;
  padding: 20px 0;
  font-size: 19px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  overflow: hidden;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  -moz-border-radius: 40px;
  -webkit-border-radius: 40px;
  border-radius: 40px;
  -khtml-border-radius: 40px;
  background: #e5023e;
}

.card .button-container button span {
  position: relative;
  z-index: 1;
  color: #fff;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

/* .card .button-container button:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    background: #fff;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin: -15px 0 0 -15px;
    opacity: 0;
    -webkit-transition: 0.3s ease;
    transition: 0.3s ease;
    color: #000;
  } */
.card .button-container button:hover,
.card .button-container button:active,
.card .button-container button:focus {
  /* border-color: #ed2553; */
  -moz-border-radius: 40px;
  -webkit-border-radius: 40px;
  border-radius: 40px;
  -khtml-border-radius: 40px;
  background: #fff;
}

.card .button-container button:hover span,
.card .button-container button:active span,
.card .button-container button:focus span {
  color: #ed2553;
}

.card .button-container button:active span,
.card .button-container button:focus span {
  color: #ffffff;
}

.card .button-container button:active:before,
.card .button-container button:focus:before {
  opacity: 1;
  -webkit-transform: scale(10);
  transform: scale(10);
}

.card .footer {
  margin: 40px 0 0;
  color: #d3d3d3;
  font-size: 24px;
  font-weight: 300;
  text-align: center;
}

.card .footer a {
  color: inherit;
  text-decoration: none;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

.card .footer a:hover {
  color: #bababa;
}

.card.alt {
  position: absolute;
  top: 40px;
  right: -70px;
  z-index: 10;
  width: 140px;
  height: 140px;
  background: none;
  border-radius: 100%;
  box-shadow: none;
  padding: 0;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  /* Toggle */
  /* Title */
  /* Input */
  /* Button */
}

.card.alt .toggle {
  position: relative;
  background: #ed2553;
  width: 140px;
  height: 140px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #ffffff;
  font-size: 58px;
  line-height: 140px;
  text-align: center;
  cursor: pointer;
}

.card.alt .toggle:before {
  content: "\f040";
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}

.card.alt .title,
.card.alt .input-container,
.card.alt .button-container {
  left: 100px;
  opacity: 0;
  visibility: hidden;
}

.card.alt .title {
  position: relative;
  border-color: #ffffff;
  color: #ffffff;
}

.card.alt .title .close {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 60px;
  display: inline;
  color: #ffffff;
  font-size: 58px;
  font-weight: 400;
}

.card.alt .title .close:before {
  content: "\00d7";
}

.card.alt .input-container input {
  color: #ffffff;
}

.card.alt .input-container input:focus ~ label {
  color: #ffffff;
}

.card.alt .input-container input:focus ~ .bar:before,
.card.alt .input-container input:focus ~ .bar:after {
  background: #ffffff;
}

.card.alt .input-container input:valid ~ label {
  color: #ffffff;
}

.card.alt .input-container label {
  color: rgba(255, 255, 255, 0.8);
}

.card.alt .input-container .bar {
  background: rgba(255, 255, 255, 0.8);
}

.card.alt .button-container button {
  width: 100%;
  background: #ffffff;
  border-color: #ffffff;
}

.card.alt .button-container button span {
  color: #ed2553;
}

.card.alt .button-container button:hover {
  background: rgba(255, 255, 255, 0.9);
}

.card.alt .button-container button:active:before,
.card.alt .button-container button:focus:before {
  display: none;
}

/* Keyframes */
@-webkit-keyframes buttonFadeInUp {
  0% {
    bottom: 30px;
    opacity: 0;
  }
}

@keyframes buttonFadeInUp {
  0% {
    bottom: 30px;
    opacity: 0;
  }
}

.lang {
  float: right;
  position: relative;
  top: -45px;
  right: -41px;
  height: 0px;
}

.bg,
.bg-2 {
  padding: 8px;
  border-radius: 0 10px 10px 0;
}

.bg {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#e2e2e2+11,ffffff+70,ffffff+100 */
  background: rgb(226, 226, 226); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e2e2e2', endColorstr='#ffffff', GradientType=0); /* IE6-9 */
  margin-bottom: 1px;
}

.bg-2 {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+-1,ffffff+0,ffffff+5,e2e2e2+74,e2e2e2+100,ffffff+100,e2e2e2+101 */
  background: rgb(255, 255, 255); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#e2e2e2', GradientType=0); /* IE6-9 */
}

.bg:hover {
  background: rgb(255, 255, 255); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) -1%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 5%,
    rgba(226, 226, 226, 1) 74%,
    rgba(226, 226, 226, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(226, 226, 226, 1) 101%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#e2e2e2', GradientType=0); /* IE6-9 */
  margin-bottom: 1px;
}

.bg-2:hover {
  background: rgb(226, 226, 226); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(226, 226, 226, 1) 11%,
    rgba(255, 255, 255, 1) 70%,
    rgba(255, 255, 255, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e2e2e2', endColorstr='#ffffff', GradientType=0); /* IE6-9 */
}

button.login-btn:disabled {
  opacity: 0.8;
}

.error-text {
  color: #ed2553;
}
</style>
