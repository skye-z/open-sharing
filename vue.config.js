module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        },
        builderOptions: {
            productName: "OpenSharing",
            appId: "cc.stacks.opensharing",
            // compression: "maximum",
            mac: {
                icon: "./build/icon.icns"
            }
        }
    }
}