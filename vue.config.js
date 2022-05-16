module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "cc.stacks.opensharing",
                productName: "OpenSharing",
                mac: {
                    category: "public.app-category.utilities",
                    target: "dmg"
                },
                dmg: {
                    icon: "build/icon.png",
                    title: "OpenSharing Install Package"
                }
            }
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                },
            ]
        }
    }
}