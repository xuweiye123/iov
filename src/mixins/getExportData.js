const commonExport = {
    methods: {
        getExportData(title, tableList, listData){
            return this.setExportData(title, tableList, listData)
        },
        setExportData(title, tableList, listData){
            console.log('开始导出')
            let headList = []
            tableList.forEach( item=> {
                let arr = {
                    headField: item.prop,
                    headName: item.value
                }
                let needMerge = item.needMerge?item.needMerge:false
                arr.needMerge = needMerge
                headList.push(arr)
            })
            let data = []
            listData.forEach( r=> {
                let itemData = {}
                headList.forEach( k=> {
                    let fieldValue =  r[k.headField]
                    if(fieldValue === 'content'){
                        fieldValue = fieldValue.replace(/[\r\n]/g,'')
                    }
                    itemData[k.headField] = fieldValue 
                })
                data.push(itemData)
            })
            let objData = {
                title: title,
                head: headList,
                data: data
            }
            return objData
        }
    }
}
export { commonExport }