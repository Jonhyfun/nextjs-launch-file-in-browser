import * as vscode from 'vscode';
const cp = require('child_process');
const os = require('os');

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('next-js-page-launcher.launch', ({path}) => {
		const shellCommand = os.platform() === 'win32' ? 'start' : 'open';
		const port = vscode.workspace.getConfiguration().get('next-js-page-launcher.settings.port');
		cp.exec(`${shellCommand} https://localhost:${port}${path.split('/pages')[1].replace('.tsx','').replace('.jsx', '').replace('index','')}`);
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
