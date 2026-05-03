import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import path from "node:path";

try {
    const version = core.getInput('version', { required: true })
    const userPath = core.getInput('path', { required: false })

    if (userPath.startsWith('/') || userPath.startsWith('~')) {
        throw new Error("Path must be relative to the workspace")
    }

    const pathPrefix = "https://github.com/premake/premake-core/releases/download/" + "v" + version + "/premake-" + version
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd()
    const premakePath = path.join(workspace, userPath)

    if (process.platform === "win32") {
        const premake = await tc.downloadTool(pathPrefix + "-windows.zip")
        await tc.extractZip(premake, premakePath)
    }
    else if (process.platform === "darwin") {
        const premake = await tc.downloadTool(pathPrefix + "-macosx.tar.gz")
        await tc.extractTar(premake, premakePath)
    }
    else {
        const premake = await tc.downloadTool(pathPrefix + "-linux.tar.gz")
        await tc.extractTar(premake, premakePath)
    }

    core.addPath(premakePath)
} catch (err) {
    core.setFailed(`Failed to install premake: ${err}`);
}
