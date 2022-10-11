Vue.component("FilterComponent",{
    data: function() {
        return {
            buttonList:[
                {text:'全部', value:'all'},
                {text:'未完成', value:'undone'},
                {text:'完成', value:'done'},
            ]
        }
    },
    template:`
    <p>
        <button v-for="item of buttonList" :key="item.text" @click="$emit('filter', item.value)">
            {{ item.text }}
        </button>
    </p>
    `
} )
//外到內，資料在外層，Input時再丟到裡面處理
Vue.component("InputComponent",{
    data: function(){
        return {
            compositionStatus:false,
        }
    },
    props:['value'],
    template:`
    <p><input type="text" 
    v-bind:value = "value"
    v-on:input = "$emit('input', $event.target.value)"
    @compositionstart="cstarHandler"
    @compositionend="cendHandler"
    @keyup.enter="inputHandler">
</p>
    `,
    methods:{
        cstarHandler(){
            this.compositionStatus = true;
        },
        cendHandler(){
            this.compositionStatus = false;
        },
        inputHandler(){
            if(this.compositionStatus) return false
            this.$emit("custom-input")
        },
    }
})

//內到外
Vue.component("InputComponent2",{
    data: function(){
        return {
            compositionStatus:false,
            inputText:"",
        }
    },
    template:`
    <p><input type="text" 
    v-model="inputText"
    @compositionstart="cstarHandler"
    @compositionend="cendHandler"
    @keyup.enter="inputHandler">
</p>
    `,
    methods:{
        cstarHandler(){
            this.compositionStatus = true;
        },
        cendHandler(){
            this.compositionStatus = false;
        },
        inputHandler(){
            if(this.compositionStatus) return false
            this.$emit("custom-input", this.inputText)
            this.inputText = ""
        },
    }
})

// 1.傳物件 2.傳資料
Vue.component("list-item-component",{
    data(){
        return {
        editingText: "",
        }
    },
    //props抓的東西是HTML裡TEMPLATE中的屬性，屬性裡綁的資料在外層
    props:["item",'editing'],
    template:`
<li>
    <template v-if="editing === item">
        <input type="text" v-model="editingText">
        <button @click="completeHandler">完成</button>
        <button @click="cancelHandler">取消</button>
    </template>
    <template v-else>
        <input type="checkbox" v-model="status">
        {{ item.content }}
        <button @click="editHandler(item)">修改</button>
        <button @click="deleteHandler(item)">刪除</button>   
    </template>
</li>
    `,
    computed:{
        status:{
            get(){
                return this.item.status
            },
            set(value) {
                this.$emit("change",this.item,value)
            }
        }
    },
    methods:{
        deleteHandler(item){
            this.$emit("delete" , item)

            // this.list = this.list.filter((target) => {
            //     return target!=item;
            // })
            // this.list.splice(index,1)
        },
        editHandler(item){
            this.$emit("edit",item)
            // this.editing = item
            this.editingText = item.content
        },
        completeHandler(){
            this.$emit("complete", this.editingText)
            // this.editing.content = this.editingText;
            this.cancelHandler();
        },
        cancelHandler(){
            this.editingText = '';
            this.$emit("cancel")
        },
    }
})


new Vue({
    el:'#app',
    data:{
        inputText:"",
        list:[],
        editing: null,
        show:"all",
    },
    methods: {
        filterHandler(value){
            this.show = value
        },
        deleteHandler(item){
            this.list = this.list.filter((target) => {
                return target!=item;
            })
            // this.list.splice(index,1)
        },
        editHandler(item){
            this.editing = item
        },
        completeHandler(value){
            this.editing.content = value;
        },
        cancelHandler(){
            this.editing = null;
        },
        inputHandler(){
            this.list.push({
                timestamp: new Date().getTime(),
                status: false,
                content: this.inputText,
            });
            this.inputText = ""
        },
        input2Handler(value){
            this.list.push({
                timestamp: new Date().getTime(),
                status: false,
                content: value
            });
        },
        changeHandler(item, value){
            item.status = value
            console.log(value)
        },
    },
    computed:{
        filterList() {
            // all, undone, done
            if (this.show ==="all") return this.list
            else if (this.show =="undone") {
                return this.list.filter((item) => {
                    return item.status === false
                })
            }
            else if (this.show ==="done") {
                return this.list.filter((item) => {
                    return item.status === true
                })
            }
            else{
                return []
            }
        },
    },
})