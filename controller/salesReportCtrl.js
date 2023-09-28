const orderModal = require("../model/orderModal")
const moment=require('moment')
const excel=require('exceljs')
const puppeteer = require("puppeteer");


const getSalesReport=async(req,res,next)=>{
    try {
        res.render('admin/sales-report',{layout:'./layout/adminLayout.ejs'})
    } catch (error) {
        console.log(error)
    }
}


const salesReport=async (req, res, next) => {0

    try {


 let {from,to}=req.query
    
    const ITEMS_PER_PAGE=9
    const CURRENT_PAGE_NUMBER=req.query.pageno

    const today = moment().format('YYYY-MM-DD')
   
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
   
    const last7days = moment().subtract(7, 'days').format('YYYY-MM-DD')
   
    const last30days = moment().subtract(30, 'days').format('YYYY-MM-DD')
   
    const lastYear = moment().subtract(1, 'years').format('YYYY-MM-DD')
   
   
    if (!from || !to) {
    from = last30days
   
    to = today
   
    }
   
   
    if (from > to) [from, to] = [to, from]
   
    to += 'T23:59:59.999Z'
    const NO_OF_ORDERS = (await orderModal.find({ createdAt: { $gte: from, $lte: to }, orderStatus: 'Delivered' })).length
    NO_OF_BUTTONS=Math.floor(NO_OF_ORDERS/ITEMS_PER_PAGE)

    const orders = await orderModal.find({ createdAt: { $gte: from, $lte: to }, orderStatus: 'Delivered' }).populate(
   
    'user'
   
    )
    .skip(ITEMS_PER_PAGE*CURRENT_PAGE_NUMBER)
    .limit(ITEMS_PER_PAGE)

 from = from.split('T')[0]
 to = to.split('T')[0]
 const netTotalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0)
 const netFinalAmount = orders.reduce((acc, order) => acc + order.finalAmount, 0)
 const netDiscount = orders.reduce((acc, order) => acc + order.discountAmount, 0)
 const dateRanges = [
   
  { text: 'Today', from: today, to: today },          
  { text: 'Yesterday', from: yesterday, to: yesterday },          
  { text: 'Last 7 days', from: last7days, to: today },          
  { text: 'Last 30 days', from: last30days, to: today },
  { text: 'Last year', from: lastYear, to: today },
   
    ]

  console.log(orders, from, to, dateRanges, netTotalAmount, netFinalAmount, netDiscount)
   
    res.render('admin/sales-report', { layout:'./layout/adminLayout.ejs',
     orders, from, to, dateRanges, netTotalAmount, 
     netFinalAmount, netDiscount,NO_OF_BUTTONS })      
    } catch (error) {
     console.log(error)
    next(error)
   
    }
   
    }

const downloadReports= async (req, res, next) => {
        try {console.log("Hi")
          const { type } = req.params
          let { from, to } = req.query
          to += 'T23:59:59.999Z'
          const orders = await orderModal.find({ createdAt: { $gte: from, $lte: to }, orderStatus: 'Delivered' }).populate(
            'user'
          )
          const netTotalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0)
          const netFinalAmount = orders.reduce((acc, order) => acc + order.finalPrice, 0)
          const netDiscount = orders.reduce((acc, order) => acc + order.discountAmount, 0)
    
          if (type === 'excel') {
            const workbook = new excel.Workbook()
            const worksheet = workbook.addWorksheet('Report')
    
            worksheet.columns = [
              { header: 'SL. No', key: 's_no', width: 10 },
              { header: 'Order ID', key: 'oid', width: 20 },
              { header: 'Date', key: 'createdAt', width: 20 },
              { header: 'User ID', key: 'userID', width: 20 },
              { header: 'Total Price', key: 'totalAmount', width: 20 },
              { header: 'Discount', key: 'discountAmount', width: 20 },
              { header: 'Final Price', key: 'finalPrice', width: 20 },
              { header: 'Payment Mode', key: 'paymentMode', width: 20 },
            ]
    
            worksheet.duplicateRow(1, 8, true)
            worksheet.getRow(1).values = ['Sales Report']
            worksheet.getRow(1).font = { bold: true, size: 16 }
            worksheet.getRow(1).alignment = { horizontal: 'center' }
            worksheet.mergeCells('A1:H1')
    
            worksheet.getRow(2).values = []
            worksheet.getRow(3).values = ['', 'From', from]
            worksheet.getRow(3).font = { bold: false }
            worksheet.getRow(3).alignment = { horizontal: 'right' }
            worksheet.getRow(4).values = ['', 'To', to.split('T')[0]]
            worksheet.getRow(5).values = ['', 'Total Orders', orders.length]
            worksheet.getRow(6).values = ['', 'Net Final Price', netFinalAmount]
    
            worksheet.getRow(7).values = []
            worksheet.getRow(8).values = []
    
            let count = 1
            orders.forEach((order) => {
              order.s_no = count
              order.oid = order._id.toString().replace(/"/g, '')
              order.userID = order.user.email
              worksheet.addRow(order)
              count += 1
            })
    
            worksheet.getRow(9).eachCell((cell) => {
              cell.font = { bold: true }
            })
    
            worksheet.addRow([])
            worksheet.addRow([])
    
            worksheet.addRow(['', '', '', '', '', '', 'Net Total Price', netTotalAmount, ''])
            worksheet.addRow(['', '', '', '', '', '', 'Net Discount Price', netDiscount, ''])
            worksheet.addRow(['', '', '', '', '', '', 'Net Final Price', netFinalAmount, ''])
            worksheet.lastRow.eachCell((cell) => {
              cell.font = { bold: true }
            })
    
            await workbook.xlsx.writeFile('sales_report.xlsx')
            const file = `${__dirname}/../sales_report.xlsx`
            res.download(file)
          } else {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
    
            // Set content and styles for the PDF
            const content = `
                    <!DOCTYPE html>
                    <html lang="en">
    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        <style>
                            .text-center {
                                text-align: center;
                            }
    
                            .text-end {
                                text-align: end;
                            }
    
                            .table-container {
    
                                width: 80%;
                                margin: 0 auto;
                                margin-top: 1.5rem;
                                border-radius: 5px;
                            }
    
                            table {
                                caption-side: bottom;
                                border-collapse: collapse;
                                margin-bottom: 1rem;
                                vertical-align: top;
                                border-color: #dee2e6;
                                border: 1px solid #ccc;
                                border-bottom: 1px solid #444;
                                width: 80%;
                                margin: 0 auto;
                                margin-top: 1.5rem;
                                border-radius: 10px;
                            }
    
                            thead {
                                border-color: inherit;
                                border-style: solid;
                                border-width: 0;
                                vertical-align: bottom;
                            }
    
                            tr {
                                font-size: 12px;
                                border-color: inherit;
                                border-style: solid;
                                border-width: 0;
                            }
    
                            td {
                                border-color: inherit;
                                border-style: solid;
                                border-width: 0;
                                padding: .5rem .5rem;
                                background-color: transparent;
                                border-bottom-width: 1px;
                                box-shadow: inset 0 0 0 9999px #fff;
                                max-width: 100px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
    
                            .d-flex-column {
                                display: flex;
                                flex-direction: column;
                            }
    
                            .fw-bold {
                                font-weight: bold;
                            }
    
                            * {
                                font-size: 14px;
                                color: #444;
                            }
                        </style>
                    </head>
    
                    <body>
                        <div>
                            <div class="text-center">
                                <h6>Sales reports</span>
                            </div>
    
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">SL. No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">User ID</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Total Price</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Final Price</th>
                                        <th scope="col">Payment Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
    
                                    ${orders
                      .map(
                        (order, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${order._id.toString().replace(/"/g, '')}</td>
                                        <td>${order.createdAt.toISOString().split('T')[0]}</td>
                                        <td>${order.user.email}</td>
                                        <td>${order.totalAmount}</td>
                                        <td>${order.discountAmount}</td>
                                        <td>${order.finalPrice}</td>
                                        <td>${order.paymentMode}</td>
                                    </tr>`
                      )
                      .join('')}
    
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div class="d-flex-column text-end">
                                                <br>
                                                <span>Net Total Price:</span>
                                                <span>Net Discount:</span>
                                                <span class="fw-bold">Net Final Price:</span>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="d-flex-column">
                                                <br>
                                                <span>${netTotalAmount}</span>
                                                <span>${netDiscount}</span>
                                                <span class="fw-bold">${netFinalAmount}</span>
                                            </div>
                                        </td>
                                    </tr>
    
                                </tbody>
                            </table>
    
                        </div>
                    </body>
    
                    </html>`
    
            await page.setContent(content)
            await page.pdf({ path: 'sales_report.pdf', format: 'A4' })
    
            await browser.close()
    
            const file = `${__dirname}/../sales_report.pdf`
            res.download(file)
          }
        } catch (error) {
          console.log(error)
          next(error)
        }
      }

const monthlyReport = async (req, res) => {
        try {
          const start = moment().subtract(30, "days").startOf("day"); // Data for the last 30 days
          const end = moment().endOf("day");
      
          const orderSuccessDetails = await orderModal.find({
            createdAt: { $gte: start, $lte: end },
            orderStatus: "Delivered",
          });
          
          const monthlySales = {};
      
          orderSuccessDetails.forEach((order) => {
            const monthName = moment(order.order_date).format("MMMM");
            if (!monthlySales[monthName]) {
              monthlySales[monthName] = {
                revenue: 0,
                productCount: 0,
                orderCount: 0,
                codCount: 0,
                razorpayCount: 0,
              };
            }
            
            monthlySales[monthName].revenue += order.totalAmount;
            monthlySales[monthName].productCount += order.items.length;
            monthlySales[monthName].orderCount++;
      
            if (order.payment === "cod") {
              monthlySales[monthName].codCount++;
            } else if (order.payment === "Razorpay") {
              monthlySales[monthName].razorpayCount++;
            }
          });
      
          const monthlyData = {
            labels: [],
            revenueData: [],
            productCountData: [],
            orderCountData: [],
            codCountData: [],
            razorpayCountData: [],
          };
      
          for (const monthName in monthlySales) {
            if (monthlySales.hasOwnProperty(monthName)) {
              monthlyData.labels.push(monthName);
              monthlyData.revenueData.push(monthlySales[monthName].revenue);
              monthlyData.productCountData.push(monthlySales[monthName].productCount);
              monthlyData.orderCountData.push(monthlySales[monthName].orderCount);
              monthlyData.codCountData.push(monthlySales[monthName].codCount);
              monthlyData.razorpayCountData.push(
                monthlySales[monthName].razorpayCount
              );
            }
          }
          
          return res.json(monthlyData);
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({
              message: "An error occurred while generating the monthly report.",
            });
        }
      };
    


      

module.exports={
    getSalesReport,salesReport,downloadReports,
    monthlyReport
}