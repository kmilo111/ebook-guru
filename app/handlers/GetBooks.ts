export async function handler(event:any) {
    console.log('object', event);
    return {
        statusCode:200,
        body: JSON.stringify({message:'get books'})
    }
}