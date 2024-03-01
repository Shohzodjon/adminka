<template>
  <div id="components-form-demo-vuex">
    <a-row>
      <a-col :span="12">
        <div class="form_field">
          <label>{{ $t("FormFirstName") }}</label>
          <a-input
            v-model="form.first_name"
            :placeholder="$t('FormFirstNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormLastName") }}</label>
          <a-input
            v-model="form.last_name"
            :placeholder="$t('FormLastNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormMiddleName") }}</label>
          <a-input
            v-model="form.middle_name"
            :placeholder="$t('FormMiddleNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormBirthDate") }}</label>
          <a-date-picker @change="onChange" />
        </div>
        <div class="form_field">
          <label>{{ $t("FormGender") }}</label>
          <a-radio-group v-model="form.gender" @change="onChange">
            <a-radio value="M"> {{ $t("FormMale") }} </a-radio>
            <a-radio value="F"> {{ $t("FormFemale") }} </a-radio>
          </a-radio-group>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="form_field">
          <label>{{ $t("FormUsername") }}</label>
          <a-input
            v-model="form.username"
            :placeholder="$t('FormUsernamePlace')"
            :class="{
              invalid: $v.form.username.$dirty && !$v.form.username.required
            }"
          />
          <small
            v-if="$v.form.username.$dirty && !$v.form.username.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
        </div>
        <div class="form_field">
          <label>{{ $t("FormPassword") }}</label>
          <a-input
            v-model="form.password"
            :placeholder="$t('FormPasswordPlace')"
            :class="{
              invalid: $v.form.password.$dirty && !$v.form.password.required
            }"
          />
          <small
            v-if="$v.form.password.$dirty && !$v.form.password.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
        </div>
        <div class="form_field">
          <label>{{ $t("FormPhone") }}</label>
          <a-input
            v-model="form.phone"
            type="number"
            :placeholder="$t('FormPhonePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormProfession") }}</label>
          <a-input
            v-model="form.profession"
            :placeholder="$t('FormProfessionPlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormRole") }}</label>
          <a-select
            v-model="form.role"
            default-value="Admin"
            style="width: 120px"
            :class="{
              invalid: $v.form.role.$dirty && !$v.form.role.required
            }"
          >
            <a-select-option
              v-for="role in roleList"
              :key="role.title"
              :value="role.value"
            >
              {{ role.title }}
            </a-select-option>
          </a-select>
          <small
            v-if="$v.form.role.$dirty && !$v.form.role.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
        </div>
        <div class="form_field">
          <a-button type="primary" @click="handleSubmit">
            <a-icon type="plus" />{{ $t("Add") }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators"
export default {
  data() {
    return {
      submitStatus: "Ok",
      form: {
        id: null,
        username: "",
        password: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        phone: "",
        gender: "",
        birth_date: null,
        profession: "",
        role: ""
      },
      roleList: [
        {
          value: "Admin",
          title: "Admin"
        },
        {
          value: "Moderator",
          title: "Moderator"
        },
        {
          value: "AppealsInspector",
          title: "AppealsInspector"
        }
      ],
      name: "",
      password: "",
      username: ""
    }
  },
  validations: {
    form: {
      username: { required },
      password: { required },
      role: { required }
    }
  },
  // watch: {
  //   username(val) {
  //     // console.log('this.$store.state.username: ', val);
  //     this.form.setFieldsValue({ username: val })
  //   }
  // },
  created() {
    this.form.id = (this.$route.params && this.$route.params.id) || null
    this.fetchData()
  },
  // created() {
  // this.form = this.$form.createForm(this, {
  //   onFieldsChange: (_, changedFields) => {
  //     this.$emit("change", changedFields)
  //   },
  //   mapPropsToFields: () => {
  //     return {
  //       username: this.$form.createFormField({
  //         value: this.username
  //       })
  //     }
  //   },
  // eslint-disable-next-line no-unused-vars
  // onValuesChange: (_, values) => {
  // console.log(values);
  // Synchronize to vuex store in real time
  // this.$store.commit('update', values)
  //   }
  // })
  // },
  methods: {
    async handleSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        return
      } else {
        const data = {}
        for (const key in this.form) {
          if (this.form[key] || this.form[key] === 0) {
            data[key] = this.form[key]
          }
        }
        let res = this.form.id
          ? await this.$store.dispatch("user/updateItemAction", data)
          : await this.$store.dispatch("user/createItemAction", data)
        console.log(res, "res")
        this.ISVALID(res, () => {
          this.$router.push({
            name: "users"
          })
        })
      }
      // e.preventDefault()

      // this.form.validateFields((err, values) => {
      //   if (!err) {
      //     console.log("Received values of form: ", values)
      //     this.$store.dispatch("user/createItemAction", values)
      //   }
      // })
    },
    fetchData() {
      if (this.$route.params && this.$route.params.id) {
        this.$store
          .dispatch("user/detail", this.$route.params.id)
          .then((res) => {
            this.form = res && res.data
          })
      }
    },
    onChange(e) {
      e = this.moment(e).format("DD-MM-YYYY")
      this.form.date = e
    }
  }
}
</script>
<style>
#components-form-demo-vuex .language-bash {
  max-width: 400px;
  border-radius: 6px;
  margin-top: 24px;
}
form {
  padding: 64px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
form > div {
  width: 30%;
  margin: 15px 0;
}
form > div > label {
  display: block;
}

.form_field {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.form_field > .deputy_image {
  width: 70px;
  height: 70px;
  border: 1px solid grey;
  border-radius: 40px;
  overflow: hidden;
  display: inline;
  margin-right: 30px;
}
.form_field > .deputy_image > img {
  width: 100%;
  height: 100%;
}
.form_field > label {
  margin-bottom: 7px;
  display: block;
  width: 100%;
}
.form_field > div {
  width: 100%;
}
.form_field > button {
  margin-left: auto;
}
.form_field_btn {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.form_field > .ant-select {
  width: 100% !important;
}
.form_field > .ant-calendar-picker {
  width: 100% !important;
}
</style>
