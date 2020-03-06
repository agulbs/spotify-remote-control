// implement async await
async function requestData(params) {
    return await request(params);
}


// execute http request
// params: {json} specs for request
function request(params) {
    return $.ajax({
        url: params['url'],
        type: params['type'],
        contentType: "application/json",
        data: JSON.stringify(params['data'])
    });
}