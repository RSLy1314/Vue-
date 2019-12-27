//这个对象的主作用是为了收集数据的依赖与发布订阅更新数据
class Mvvm {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        // console.log(this.$options);
        // console.log(this.$data);
        this.observe(this.$data);
        new Complier(options.el,this);
         if (options.created) {
            options.created.call(this)
         }
        // new Watcher();
        // this.$data.name
    }
    // 变化侦测
    observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(key => { // 拿到所有的key
            this.defineReactive(data,key,data[key]);
            this.proxyData(key)
        })
    }
    // 监听响应
    defineReactive(objOfData,key,val) {
        this.observe(val); // 递归子节点
        const dep = new Dep();
        Object.defineProperty(objOfData,key, {
            get() {
                Dep.target && dep.addDeps(Dep.target);
                return val
            },
            set(newVal) {
                if (val===newVal) {
                    return;
                }
                val = newVal;
                dep.notify()
            }
        })
    }
    proxyData(key) {
        Object.defineProperty(this,key, {
            get() {
                return this.$data[key];
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}
// 依赖收集
class Dep {
    constructor(dep) {
        // 存放依赖，即是若干watcher
        this.deps = [];
    }
    addDeps(dep) {
        this.deps.push(dep)
    }
    // 通知更新
    notify() {
        this.deps.forEach(dep => dep && dep.update()) // 因为静态属性指向watcher所以得到update方法
    }
}
// watcher
class Watcher {
    constructor(vm,key,cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        Dep.target = this // hack手段 使得Dep的静态属性指向watcher 保持每一个wacther都是独立的
        this.vm[this.key];
        Dep.target = null;
    }
    update() {
        // console.log('更新了');
        this.cb.call(this.vm,this.vm[this.key])
    }
}