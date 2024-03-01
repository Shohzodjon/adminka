<template>
    <a-row>
        <a-row class="content-title" type="flex">
            <h2 class="flex-1">
                {{ $route.meta.title[$i18n.locale] }}
            </h2>

            <!-- <a-row class="flex-no__wrap ml-auto " type="flex">
                <a-input v-model="searchVal" :placeholder="$t('search')" class="croud-search-input" allow-clear
                    @input="searchFunc" />
                <a-select v-model="user" option-label-prop="label" class="selects">
                    <a-select-option v-for="item in " :key="item.id" :value="item.id"
                        :label="item.author.last_name + ' ' + item.author.first_name">
                        {{ item.author.first_name + " " + item.author.last_name + " " + item.author.middle_name }}
                    </a-select-option>
                </a-select>
            </a-row> -->
        </a-row>

        <a-table :key="$route.fullPath" :columns="columns" :data-source="list" :loading="loading" :pagination="true"
            @change="handleTableChange">
            <template slot="number" slot-scope="item">
                {{ list.indexOf(item) + 1 }}
            </template>
            <template slot="detail" slot-scope="item">
                <span>{{ item.full_name }} </span>
            </template>
            <template slot="office" slot-scope="item">
                <span>{{ item.work_place }}</span>
            </template>
            <template slot="profession" slot-scope="item">
                <span>{{ item.specialty }}</span>
            </template>
            <template slot="academic" slot-scope="item">
                <span v-if="item.education == 1" style="text-transform: capitalize;">{{ $t('higherEducation') }}</span>
                <span v-if="item.education == 2" style="text-transform: capitalize;">{{ $t('mediumEducation') }}</span>
            </template>
            <template slot="time" slot-scope="item">
                <span>{{ item.created_at.split('.')[0].replace('T', " ") }}</span>
            </template>
            <template slot="link" slot-scope="item">
                <a-button type="primary" class="url-btn" @click="showModal(list.indexOf(item))">{{ $t('Urll') }}</a-button>
            </template>
        </a-table>
        <a-modal v-for="(item, index) in list" :key="index" v-model="item.visible" :title="$t('Urll')"
            @ok="handleOk(index)">
            <template #footer>
                <a-button key="cancel" type="primary" @click="handleCancel(index)">{{ $t('Cancel') }}</a-button>
                <a-button key="submit" type="primary" class="success" @click="submitFraction(index)"
                    :data-id="item.applicant.id">{{
                        $t('Save') }}</a-button>
            </template>
            <a-row>
                <a-col :span="3" style="text-align: right; margin-right: 10px">
                    <label for="">{{ $t('Urll') }} : </label>
                </a-col>
                <a-col :span="9">
                    <a-input v-model="item.inputValue" placeholder="https://example.com" type="url" pattern="https://.*"
                        :class="[warmingError ? 'warming-error' : '']" allow-clear />
                </a-col>
            </a-row>
        </a-modal>
    </a-row>
</template>
<script>
import { required } from "vuelidate/lib/validators"
export default {

    data() {
        return {
            columns: [
                {
                    title: "№",
                    key: "id",
                    // class: "wanted-fio-td",
                    scopedSlots: { customRender: "number" },
                    width: '5%'
                },
                {
                    title: this.$t("fullName"),
                    key: "detail",
                    scopedSlots: { customRender: "detail" },
                    width: "30%"
                },
                {
                    title: this.$t("FormWorkPlace"),
                    key: "office",
                    class: "wanted-fio-td",
                    scopedSlots: { customRender: "office" },
                    width: "12%"
                },
                {
                    title: this.$t("FormSpec"),
                    key: "profession",
                    scopedSlots: { customRender: "profession" },
                    width: '12%'
                },
                {
                    title: this.$t("FormAcademDeg"),
                    key: "academic",
                    scopedSlots: { customRender: "academic" },
                    width: '12%'
                },
                {
                    title: this.$t("timeApplication"),
                    key: "time",
                    scopedSlots: { customRender: "time" },
                    width: '12%'
                },
                {
                    title: this.$t("Urll"),
                    key: "link",
                    scopedSlots: { customRender: "link" },
                    width: '12%'
                },
            ],
            loading: false,
            user: '',
            link: [],
            searchVal: '',
            list: {},
            warmingError: false,
            form: {
                link: '',
                applicant: ''
            }
        }
    },
    validations: {
        form: {
            link: { required }
        }
    },

    mounted() {
        this.fetchLists();
    },
    methods: {

        handleTableChange() {
            console.log('pagination')
        },
        showModal(index) {
            this.list[index].visible = true;
        },
        handleOk(index) {
            this.list[index].visible = false;
        },
        handleCancel(index) {
            this.list[index].visible = false;
        },
        searchFunc() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false
            }, 2000)
        },
        async fetchLists() {
            let res = await this.$api.get("/appeals/list/?is_krausorsing=true")
            this.list = res && res.data;
        },
        async submitFraction(index) {
            if (this.list[index].inputValue == '') {
                this.warmingError = true;
                return;
            } else {
                this.warmingError = false;
            }
            this.form.applicant = this.list[index].applicant.id;
            this.form.link = this.list[index].inputValue;
            this.form.appeal = this.list[index].id;
            let form = this.form
            let f = new FormData()
            Object.keys(form).forEach((k) => {
                k != "image" && f.append(k, form[k])
                k == "image" && f.append(k, form[k])
            })
            const res = await this.$api.post("/structure/roles/create/", f);
            this.list[index].visible = false;

            this.ISVALID(res, () => {
                console.log('work')
            })
        },
    }
}
</script>
<style scoped>
.url-btn {
    width: 148.81px;
    height: 36px;
    padding: 7px, 7.8px, 8px, 8px;
    border-radius: 6px;
    background: #0B4AA8;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
}

.success {
    background-color: #1890ff;
    margin-left: 8px;
    color: #fff;
    border-radius: 8px;
}

.success:hover {
    background-color: #1890ff;
    color: #fff;
}

.success:focus {
    background-color: #1890ff;
    color: #fff;
}

.selects {
    width: 200px !important;
    margin-right: 15px;
}

.croud-search-input {
    border-radius: 2px;
    color: #BFBFBF;
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    padding-left: 10px;
    width: 200px !important;
    margin-right: 10px;
}

.warming-error {
    border: 1px solid red !important;
}
</style>
  