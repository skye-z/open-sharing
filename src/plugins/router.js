import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: to => {
            return {path: '/res'}
        },
    },
    buildConfig('/res', 'resources', '/res'),
    buildConfig('/net', 'network', '/net'),
    buildConfig('/sec', 'security', '/sec'),
    buildConfig('/set', 'setup', '/set'),
]

function buildConfig(path, name, file,) {
    return {
        path,
        name,
        component: () => import('@/views' + file)
    }
}

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router