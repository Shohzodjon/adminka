<template>
  <a-row>
    <div class="appeal-wrapper" id="printMe">
      <a-row class="content-title" type="flex">
        <div style="text-align: center;">
          <h2 class="flex-1">Ўзбекистон Республикаси Олий Мажлиси Қонунчилик палатаси виртуал қабулхонасига келиб тушган мурожаат</h2>
          <br />
          <h3>№ {{ form.id }}</h3>
        </div>
      </a-row>
      
      <table style="width: 100%;" v-if="!loading">
        <tbody>
          <tr v-if="form.full_name">
            <th>Ф.И.О</th>
            <td>{{ form.full_name }}</td>
          </tr>
          <tr v-if="form.region">
            <th>Мурожаат жўнатилган вақт</th>
            <td>{{ getDate(form.created_at) }}</td>
          </tr>
          <tr v-if="form.region">
            <th>{{ $t("Region") }}</th>
            <td>{{ form.region && form.region.title }}</td>
          </tr>
          <tr v-if="form.district">
            <th>Туман/шаҳар</th>
            <td>{{ form.district && form.district.title }}</td>
          </tr>
          <tr v-if="form.address">
            <th>{{ $t("Adress") }}</th>
            <td>{{ form.address }}</td>
          </tr>
          <tr v-if="form.email">
            <th>Э-Почта</th>
            <td>{{ form.email }}</td>
          </tr>
          <tr v-if="form.phone_number">
            <th>{{ $t("FormPhone") }}</th>
            <td>{{ form.phone_number }}</td>
          </tr>
          <tr v-if="form.birth_date">
            <th>{{ $t("FormBirthDate") }}</th>
            <td>{{ form.birth_date }}</td>
          </tr>
          <tr v-if="form.applicant_status">
            <th>{{ $t("SenderStatus") }}</th>
            <td>{{ getStatusAplicant(form.applicant_status) }}</td>
          </tr>
          <tr v-if="form.status" class="printNo">
            <th>{{ $t("Status") }}</th>
            <td>{{ getStatus(form.status) }}</td>
          </tr>
          <tr>
            <th>{{ $t("ToWhom") }}</th>
            <td>
              <span>{{ form.appeal_type == 1 ? $t("toOLiyMajlis") : form.appeal_type == 2 ? $t("toSpiker") : form.appeal_type == 3 ? $t("toAssistantSpeaker") : form.appeal_type == 4 ? $t("toFraction") : form.appeal_type == 5 ? $t("toCommission") : form.appeal_type == 6 ? $t("toCommittee") : form.appeal_type == 7 ? $t("toDeputy") : "" }}</span>
              <br />
              
              <span v-if="form.appeal_type == 4">{{ form.whom && form.whom.fraction && form.whom.fraction.title}}<br /></span>
              <span v-if="form.appeal_type == 6">{{ form.whom && form.whom.committee && form.whom.committee.title}}<br /></span>

              <span v-if="form.appeal_type != 1">{{ form.whom && form.whom.last_name }}
              {{ form.whom && form.whom.first_name }}
              {{ form.whom && form.whom.middle_name }}</span>

            </td>
          </tr>
          <tr class="printNo">
            <th>{{ $t("File") }}</th>
            <td>
              <div class="appeal_files">
                <a
                  v-for="file of form.attachments"
                  :key="file.id"
                  :href="file.file"
                  download
                >
                  <!-- {{ file.file | splitFileName }} -->
                  Юклаб олиш
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t("textApplication") }}</th>
            <td>
              <p>{{ form.content }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Маълумотлар юкланмоқда...</p>
    </div>
    <a-row class="form-buttons__action" type="flex">
      <a-button v-if="form.status == 1" type="primary" @click="onClick">
        <a-icon type="plus" />{{ $t("Consider") }}
      </a-button>
      <a-button
        v-if="form.status == 2"
        type="primary"
        @click="
          $router.push({
            name: 'appeals-response',
            params: { id: $route.params.id }
          })
        "
      >
        <a-icon type="plus" />{{ $t("Answer") }}
      </a-button>
      <a-button v-if="form.status == 3" type="primary" @click="showModal">
        <a-icon type="plus" />{{ $t("ViewAnswer") }}
      </a-button>
      <a-button type="primary"  style="margin-left: 16px;" v-print="printObj">Чоп этиш</a-button>
      <a-modal v-model="visible" title="Ответ" @ok="handleOk">
        <div
          v-for="item of form.responses"
          :key="item.id"
          class="modal-content"
        >
          <ul class="my-list">
            <li>
              <b>{{ $t("TagsColTitle") }}:</b>
              <h4>{{ item.title || "Мавжуд эмас" }}</h4>
            </li>
            <li>
              <b>{{ $t("Content") }}:</b>
              <div v-html="item.content || 'Мавжуд эмас'" />
            </li>
            <li v-if="item.attachments && item.attachments.length">
              <b>{{ $t("File") }}:</b>
              <div>
                <a
                  v-for="file in item.attachments"
                  :key="file.id"
                  :href="file.file && file.file.url || ''"
                  >{{ file.file && file.file.name }}</a
                >
              </div>
            </li>
          </ul>
        </div>
      </a-modal>
    </a-row>
  </a-row>
</template>
<script>
import appeals from "@/mixins/appeals"
export default {
  filters: {
    // splitFileName(val) {
    //   let index = val.lastIndexOf("/")
    //   return val.slice(++index)
    // }
  },
  mixins: [appeals],
  data: () => {
    return {
      form: {},
      loading: false,
      visible: false,
      printLoading: true,
      printObj: {
        id: "printMe",
        popTitle: 'Олий Мажлис Қонунчилик палатаси',
      }
    }
  },
  async created() {
    this.loading = true
    this.form = await this.$store.dispatch(
      "appeals/getAppealsById",
      this.$route.params.id
    )
    this.loading = false
    console.log(this.form)
    console.log(this.loading)
  },
  methods: {
    getDate(date) {
      let res
      if(date){
        let arr = date.split("T")
        let arr2 = arr[0].split("-")
        res = arr2[2] + "." + arr2[1] + "." + arr2[0]
      }else{
        res = ""
      }
      
      return res
    },
    async onClick() {
      this.loading = true
      try {
        const id = this.$route.params.id
        await this.$api.patch(`/appeals/${id}/update/`, {
          ...this.form,
          status: 2
        })
        this.form.status = 2
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    }
  }
}
</script>
<style>
.ant-modal{
  width: 720px!important;
}
table{
  margin-top: 16px;
  margin-bottom: 20px;
}
table th,
table td{
  font-size: 16px;
  border: 1px solid #dedede;
  padding: 8px 16px;
}
@media print {
  .printNo{
    display: none;
  }
}
.appeals__menu li {
  padding-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
}
.appeals__menu b {
  width: 200px;
}
.appeals__menu span {
  width: 40%;
}
.modal-content {
  display: flex;
}
.modal-content__left {
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-right: 20px;
}
.modal-content__left b {
  display: inline-block;
  margin-top: 15px;
}
.modal-content__right h4 {
  display: inline-block;
  margin-top: 15px;
}
.modal-content__right div {
  margin-top: 15px;
}
.modal-content__right a {
  display: block;
  margin-top: 15px;
}
.appeal_files {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  width: 100%;
}
.appeal_files > a {
  width: 100%;
  margin-bottom: 5px;
}
.appeal_files > a:last-child {
  margin-bottom: 0;
}
.my-list {
  width: 100%;
}
.my-list li {
  display: flex;
  width: 100%;
  margin-bottom: 16px;
}
.my-list li:last-child{
  margin-bottom: 0;
}
.my-list li b {
  width: 120px;
  flex: 0 0 120px;
}
</style>
