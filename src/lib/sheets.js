// // Get new array from Google Sheets API
//     //Only get if new 24 hour period

// const {google} = require('googleapis');
// const sheets = google.sheets('v4');

// const getPuzzle = async () => {
//   const authClient = await authorize();
//   const request = {
//     // The spreadsheet to request.
//     spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,  // TODO: Update placeholder value.

//     // The ranges to retrieve from the spreadsheet.
//     ranges: 'Sheet1A1:B2',  // TODO: Update placeholder value.

//     // True if grid data should be returned.
//     // This parameter is ignored if a field mask was set in the request.
//     includeGridData: true,  // TODO: Update placeholder value.

//     auth: authClient,
//   };

//   try {
//     const response = (await sheets.spreadsheets.get(request)).data;
//     // TODO: Change code below to process the `response` object:
//     console.log(JSON.stringify(response, null, 2));
//   } catch (err) {
//     console.error(err);
//   }
// }

async function authorize() {

    // let authClient = 'https://www.googleapis.com/auth/spreadsheets.readonly';
  
    // if (authClient == null) {
    //   throw Error('authentication failed');
    // }
  
    // return authClient;
  }

export { authorize };