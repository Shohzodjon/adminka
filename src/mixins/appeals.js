export default {
    methods: {
        getStatus(type) {
            if (type == 1) {
                return this.$t("StatusType1")
            } else if (type == 2) {
                return this.$t("StatusType2")
            } else {
                return this.$t("StatusType3")
            }
        },
        getStatusAplicant(type) {
            if (type == 1) {
                return "Работает"
            } else if (type == 2) {
                return "Безработный"
            } else if (type == 3) {
                return "Пенсионер"
            } else {
                return "Студент"
            }
        }
    }
}