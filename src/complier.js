//编译模板的对象
// 想要将数据调拨至视图层，需要拿到宿主的DOM节点，并判断类型，而后挂载到fragement片段中
class Complier {
    constructor(el,vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            this.$frag = this.nodeFragement(this.$el);
            this.complier(this.$frag);
            this.$el.appendChild(this.$frag)
        }
    }
    // 编译
    complier(el) {
        // const 
        const nodeChildren = el.childNodes;
        Array.from(nodeChildren).forEach(node => {
            // console.log(node);
            if (this.isElement(node)) {
                console.log('元素节点');
                // console.log(node.attributes);
                // element.attributes属性返回该元素所有属性节点的一个实时集合
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => { // 转为数组
                    const attrName = attr.name;
                    const exp = attr.value;
                    if (this.isDirective(attrName)) {
                        // r-text 
                         const dir =  attrName.substr(2)
                         this[dir] && this[dir](node,this.$vm,exp)
                    }
                    if (this.isEvent(attrName)) { // 事件的触发
                        const dir =  attrName.substr(1) // 取 click
                        this.enventHandler(node,this.$vm,exp,dir)
                    }
                })
            }
            if (this.isInterpolation(node)) {
                // console.log('插值文本');
                this.update(node,this.$vm,RegExp.$1,'text')
            }
            if (node.childNodes && node.childNodes.length>0) {
                this.complier(node);
            }
        })
       

    }
    
    nodeFragement(el) {
        const frag = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            frag.appendChild(child);
        }
        return frag
    }
    update(node,vm,exp,dir) {
        const updateFunc = this[dir+'Updater'];
        updateFunc && updateFunc(node,vm[exp]);
        new Watcher(vm,exp,function(value) {
            updateFunc && updateFunc(node,value);
        })
    }
    enventHandler(node,vm,exp,dir) { 
        // 事件处理
        let fn =vm.$options.methods && vm.$options.methods[exp];
        if (dir && fn) { // 监听，执行，修改this的指向
            node.addEventListener(dir,fn.bind(vm))
        }
    }
    text(node,vm,exp) {
        this.update(node,vm,exp,'text')
    }
    // 双向绑定
    model(node,vm,exp) {
        // console.log(vm);
        this.update(node,vm,exp,'model');
        node.addEventListener('input',e=> {
            vm[exp] =e.target.value;
        })
    }
    modelUpdater(node,value) {
        node.value = value;
    }
    textUpdater(node,value) {
        // console.log(node.textContent = value); //没有收集依赖
        node.textContent = value
    }
    isElement(node) {
        return node.nodeType === 1
        
    }
    isDirective(attr) {
        return attr.includes('r-')
    }
    isEvent(attr) {
        return attr.includes('@')
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}