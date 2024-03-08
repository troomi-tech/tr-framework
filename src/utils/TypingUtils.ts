/* eslint-disable @typescript-eslint/no-namespace */

export namespace TypingUtils {
	/** Allows you to specifically designate properties as required */
	export type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;
	/** Require only one property (no more, no less) from the passed interface */
	export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
		{ [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];
	/** Makes only specified properties of an object optional */
	export type PartialPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	/** Sytax sugar for `T[keyof T]` */
	export type ValueOf<T> = T[keyof T];
	/** Recursively makes all properties of an object 'never'
	 * @example MakeAllNever<{a: string, b: number}> // {a: never, b: never} */
	export type MakeAllNever<T extends object> = { [K in keyof T]: never };
	/** Makes all properties and sub-properties of an object optional */
	export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
	/** A type for either `false`, `0`, `null`, or `undefined`, or `void` */
	export type FalsyTypes = false | 0 | null | undefined | void | '';
	/** A type for anything that is not a `FalsyTypes` */
	export type TruthyTypes = Exclude<any, FalsyTypes>;
	/** Syntax sugar for Promise<T> | T */
	export type OptionalAsync<T> = T | Promise<T>;
	/** Syntax sugar for empty async function `() => void` */
	export type VoidFunction = () => void;
	/** Takes a tuple (const array) and returns an object with the values of the tuple as keys
	 * @example TupleToObject<typeof (['a', 'b'] as const)> // {a: string, b: string} */
	export type TupleToObject<T extends ReadonlyArray<string>, V = any> = {
		[K in T extends ReadonlyArray<infer U> ? U : never]: V;
	};
}
