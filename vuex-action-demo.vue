<template>
  <div>Vuex</div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'VuexDemo', // 组件名 是唯一的
    // 实例的数据对象
    data() {
        return {
            obj: {}
        }
    },
    // 接受父组件的传值
    props: {
        xx : {
            type: String,
            defaule: 'xx'
        }
    },
    // 设置需要向下传递的值，
    provide: {
        then: this
    },
    // 接受更深层次的组件的传值
    inject: {
        // then:
    },
    // 计算属性，用于同一过滤处理等。
    computed: {
        ...mapGetters([
            'legalPerSon',
            // ....
        ])
    },
    // 方法
    methods: {
        proceingObj() {

        }
    },
    // 生命周期函数，请求写在created中，视图更新写在mounted中
    created() {},
    mounted() {},
    // 监视
    watch: {},
    // 组件
    components: {},
    // 过滤器
    filters: {}
    
};
</script>

<style>
</style>