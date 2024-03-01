<template>
  <a-row type="flex" justify="center" align="middle" class="fl-1">
    <a-form :form="form" class="login-form" @submit="handleSubmit">
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: 'Введите логин!' }] }
          ]"
          placeholder="Логин"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: 'Введите пароль!' }] }
          ]"
          type="password"
          placeholder="Пароль"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-row type="flex" justify="space-between" align="middle">
        <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true
            }
          ]"
        >
          Запомнить
        </a-checkbox>

        <a-button
          :loading="loading"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          Войти
        </a-button>
      </a-row>
    </a-form>
  </a-row>
</template>

<script>
export default {
  data: () => ({
    form: null,
    loading: false
  }),
  created() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);

          this.loading = true
          // const data = this.dataToForm(values);
          this.$api
            .post("/admin/login", values)
            .then((res) => {
              if (res && res.data) {
                // console.log(res.data);
                if (res.data.token) {
                  this.$store.commit("setToken", res.data.token)
                  this.$router.push("/")
                }
              }

              this.loading = false
            })
            .catch(() => {
              // console.log(err);
              this.loading = false
            })

          // fetch("http://159.253.19.177:5000/api/v1/admin/login", {
          //   method: "POST", // *GET, POST, PUT, DELETE, etc.
          //   mode: "cors", // no-cors, cors, *same-origin
          //   credentials: "include", // include, *same-origin, omit
          //   headers: {
          //     "Content-Type": "application/json"
          //     // 'Content-Type': 'application/x-www-form-urlencoded',
          //   },
          //   body: JSON.stringify(data)
          // })
          //   .then(response => response.json())
          //   .then(res => console.log(res));
        }
      })
    }
  }
}
</script>
