import * as vscode from 'vscode';
const cp = require('child_process');
const os = require('os');

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('next-js-page-launcher.launch', ({path}) => {
		const shellCommand = os.platform() === 'win32' ? 'start' : 'open';
		const port = vscode.workspace.getConfiguration().get('next-js-page-launcher.settings.port');
		const protocol = vscode.workspace.getConfiguration().get('next-js-page-launcher.settings.protocol');
		
		findAndReplaceNextParamsWithCallback(`${protocol}://localhost:${port}${path.split('/pages')[1].replace('.tsx','').replace('.jsx', '').replace('index','')}`, (url) => {
			cp.exec(`${shellCommand} ${url}`);
		});

	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}

async function findAndReplaceNextParamsWithCallback(nextUrl: string, callback: (url: string) => void) {
	const params = nextUrl.match(/\[(.*?)\]/g);
	if(!params) {return callback(nextUrl);}
	const currentParam = params[0];
	if(currentParam) {
		await findAndReplaceNextParamsWithCallback(await handleNextParam(nextUrl, currentParam), callback);
	}
}

async function handleNextParam(nextUrl: string, nextParam: string) {
	let options: vscode.InputBoxOptions = {
		prompt: `${nextParam}: `,
		placeHolder: `(type here the id for ${nextParam})`,
		ignoreFocusOut: true,
		validateInput: input => (!input || input.includes(']') || input.includes('[')) ? 'Please enter a valid id' : null,
	};
	const value = await vscode.window.showInputBox(options) as string;
	return nextUrl.replace(nextParam, value);
}
