declare module 'get-figma-styles' {
  export function downloadDoc(apiKey: string, id: string, query?: object): Promise<object>;
  export function getMe(apiKey: string): Promise<object>;
  export function getTeamStyles(apiKey: string, teamId: string, query: object): Promise<object>;
  export function getDocStyles(doc: object, teamStyles: object): Promise<object>;
}
