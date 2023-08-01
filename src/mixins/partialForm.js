const partialForm = {
  methods: {
    checkForm(obj) {
      const arr = []
      let flag = true
      this.$refs[obj.formName].validateField(obj.formList, (e) => {
        arr.push(e)
      })
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) {
          flag = false
          break
        }
      }
      return flag
    }
  }
}
export {
  partialForm
}
