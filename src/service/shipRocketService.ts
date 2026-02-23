import axios from "axios";

import { prisma } from "../db/prisma";

import env from "../config/env";

import { CustomError } from "../middleware/errorHandler";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;

let tokenExpiresAt: number = 0;

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  console.log(env.SHIPROCKET_EMAIL, env.SHIPROCKET_PASSWORD);

  if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
    throw new CustomError("ShipRocket credentials not found", 502);
  }

  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: env.SHIPROCKET_EMAIL,
      password: env.SHIPROCKET_PASSWORD,
    });

    if (response.status !== 200 || !response.data?.token) {
      throw new CustomError(
        response.data?.message || "Failed to authenticate with ShipRocket.",
        502,
      );
    }

    cachedToken = response.data.token;

    tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    return cachedToken!;
  } catch (err: any) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      `ShipRocket login failed: ${err.response?.data?.message || err.message}`,
      502,
    );
  }
}

export async function createShiprocketOrder(payload: Record<string, any>) {
  const token = await getShiprocketToken();

  try {
    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Ship Rocket Response", response);

    if (response.status !== 200) {
      throw new CustomError(
        response.data?.message || "Failed to create ShipRocket order.",
        502,
      );
    }

    return response.data;
  } catch (err: any) {
    console.log(JSON.stringify(err.response?.data, null, 2));
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      `ShipRocket order creation failed: ${err.response?.data?.message || err.message}`,
      502,
    );
  }
}

export async function createShipRocketOrderWithDb(
  payload: Record<string, any>,
  orderId: string,
) {
  const srResponse = await createShiprocketOrder(payload);

  const shipRocketOrder = await prisma.shipRocketOrder.create({
    data: {
      // SUMAN -> ID we gave to the of our order
      orderId: orderId,
      // SUMAN -> ID of the order from generated order by shiprocket
      orderNumber: payload.order_id || null,
      srOrderId: srResponse.order_id || null,
      channelOrderId: srResponse.channel_order_id || null,
      shipmentId: srResponse.shipment_id || null,
      status: srResponse.status || "NEW",
      statusCode: srResponse.status_code || null,
      awbCode: srResponse.awb_code || null,
      courierCompanyId: srResponse.courier_company_id
        ? String(srResponse.courier_company_id)
        : null,
      courierName: srResponse.courier_name || null,
      requestPayload: payload,
      responsePayload: srResponse,
    },
  });

  return shipRocketOrder;
}

export async function getShipRocketOrderById(id: string) {
  const order = await prisma.shipRocketOrder.findUnique({
    where: { id },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          finalAmount: true,
        },
      },
    },
  });

  if (!order) {
    throw new CustomError("ShipRocket order not found", 404);
  }

  return order;
}

export async function getAllShipRocketOrders(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.shipRocketOrder.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            finalAmount: true,
          },
        },
      },
    }),
    prisma.shipRocketOrder.count(),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getShipRocketOrderTracking(shipmentId: number) {
  const token = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/courier/track/shipment/${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new CustomError(
        response.data?.message || "Failed to fetch tracking info.",
        502,
      );
    }

    return response.data;
  } catch (err: any) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      `ShipRocket tracking failed: ${err.response?.data?.message || err.message}`,
      502,
    );
  }
}

export async function getPickupLocations() {
  const token = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/settings/company/pickup`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new CustomError(
        response.data?.message || "Failed to fetch pickup locations.",
        502,
      );
    }

    return response.data;
  } catch (err: any) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      `ShipRocket pickup locations failed: ${err.response?.data?.message || err.message}`,
      502,
    );
  }
}


//	1 for Cash on Delivery and 0 for Prepaid orders.
export async function getPincodeAvailabilityAndDeliveryCharge(
  pickupPostcode: string = "785001",
  deliveryPostcode: string,
  weight: number,
  cod: number
) {
  const token = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/courier/serviceability?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=${cod}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new CustomError(
        response.data?.message || "Failed to fetch serviceability.",
        502,
      );
    }

    console.log("Response ", response.data);

    const couriers = response.data.data.available_courier_companies;

    if (!couriers || couriers.length === 0) {
      return {
        available: false,
        message: "No courier service available for this pincode.",
        couriers: [],
        rates: {
          lowest: 0,
          highest: 0,
          average: 0
        }
      };
    }

    const processedCouriers = couriers.map((c: any) => ({
      courier_name: c.courier_name,
      rate: parseFloat(c.rate),
      estimated_delivery_days: c.estimated_delivery_days,
      etd: c.etd,
      cod: c.cod === 1
    }));

    const rates = processedCouriers.map((c: any) => c.rate);
    const lowest_rate = Math.min(...rates);
    const highest_rate = Math.max(...rates);
    const average_rate = rates.reduce((a: number, b: number) => a + b, 0) / rates.length;

    return {
      available: true,
      couriers: processedCouriers,
      rates: {
        lowest: lowest_rate,
        highest: highest_rate,
        average: parseFloat(average_rate.toFixed(2))
      }
    };
  } catch (err: any) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(
      `ShipRocket serviceability check failed: ${err.response?.data?.message || err.message}`,
      502,
    );
  }
}