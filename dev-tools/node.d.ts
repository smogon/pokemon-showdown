declare namespace NodeJS {
	interface Global {
		Dex: any
		toId(input: any): string
		Config: any
		TeamValidator: any
		Chat: any
		__version: string
	}
}
