export function getQueries(url: string | URL, queryNames: string[] = []): (string | null)[] {
    const searchParams = new URL(url).searchParams;
    console.log(new URL(url));
    const queries = queryNames.map(query => searchParams.get(query));
    return queries;
}

export function lowercaseCompare(str: String ="", match: string) {
    return str.toLowerCase().includes(match.toLowerCase());
}