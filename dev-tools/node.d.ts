declare namespace NodeJS {
	interface Global {
		Dex: any
		Dnsbl: any
		toId(input: any): string
		Config: any
		TeamValidator: any
		Chat: any
		__version: string
	}
}
