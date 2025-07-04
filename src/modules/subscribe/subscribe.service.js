import axios from "axios";
import { enumPayment, userModel } from "../../DB/models/user.model.js";
import { getAccessToken } from "../../service/payment.js";
import { asyncHandler } from "../../utils/index.js";
import { createSubscription } from "./payment.js";


export const subscribe = asyncHandler(async (req, res, next)=>{
    if(!req.user)
        return next(new Error("Unauthorized", { cause: 401}));

    const user = await userModel.findOne({
        email: req.user.email,
        payment: { $in: [enumPayment.cancelled, enumPayment.free] }
    });

    if(!user)
        return next(new Error("user already subscibed",{ cause: 400 }));

    const approvalUrl = await createSubscription(req.user.email);

    if(!approvalUrl)
        return next(new Error('Error happend try again later', { cause: 500 }));

    return res.status(200).json({approvalUrl});
})
export const success = asyncHandler(async (req, res, next)=>{
    const subscriptionId = req.query.subscription_id;
    const accessToken = await getAccessToken();

    const { data } = await axios.get(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if(!data)
        return next(new Error("Error happen", {cause: 500}));

    const userEmail = data.subscriber.email_address;
    await userModel.findOneAndUpdate({
        email: userEmail,
        payment: { $in: [enumPayment.free, enumPayment.cancelled]}
    },{
        payment: enumPayment.subscribed
    })

    return res.status(200).json({message: "done"});
})


export const cancelSub = asyncHandler(async (req, res, next)=>{
    const {event} = req.body;

    if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
        const subscriptionId = event.resource.id;

        await User.findOneAndUpdate(
        { subscriptionId },
        { subscribed: false }
        );
    }

    return res.status(200).json({message: 'done'});
})