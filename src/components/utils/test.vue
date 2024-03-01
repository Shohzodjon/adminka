<template>
  <div>
    <div v-for="item in arr" :key="item.id" />
  </div>
</template>

<script>
export default {
  name: "Test",
  data: () => ({
    arr: [
      {
        id: 1,
        url: "category"
      },

      {
        id: 2,
        url: "category2",
        childrens: [
          {
            id: 1,
            url: "category2-3"
          },
          {
            id: 2,
            url: "category2",
            childrens: [
              {
                id: 1,
                url: "category2-3"
              },
              {
                id: 2,
                url: "category2",
                childrens: [
                  {
                    id: 1,
                    url: "category2-3"
                  },
                  {
                    id: 2,
                    url: "category2",
                    childrens: [
                      {
                        id: 1,
                        url: "category2-3"
                      },
                      {
                        id: 1,
                        url: "category2-4",
                        childrens: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  })
}
</script>

<style scoped></style>
