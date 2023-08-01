import { getDicValueByCode } from "@/api/commont";

const getDropList = {
  data() {
    return {};
  },
  methods: {
    getDropList(arr) {
      arr.forEach((i) => {
        getDicValueByCode(i.postData)
          .then(({ data }) => {
            if (data.code === 0) {
              this[i.key] =
                data.data && data.data.length &&
                data.data.map((j) => {
                  return { label: j.dicName, value: j.dicId };
                });
            
							//.replace(/dicName/g, "label").replace(/
              // JSON.parse(
              //   JSON.stringify(data.data)
              //     .replace(/dicName/g, "label")
              //     .replace(/dicId/g, "value")
              // );
            }
          })
          .catch(() => {});
      });
    },
  },
};

export { getDropList };
