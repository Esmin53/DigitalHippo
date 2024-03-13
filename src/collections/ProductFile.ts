import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/globals/config/types";
import { Access, CollectionConfig } from "payload/types";
import { boolean } from "zod";

const addUser: BeforeChangeHook = ({ req, data }) => {
    const user = req.user as User | null
    return { ...data, user: user?.id }
  }

  const yourOwnOrParchused: Access = async ({ req }) => {
    const user = req.user as User | null

    if(user?.role === 'admin') {
        return true
    }

    if(!user) {
        return false
    }

    const { docs: products } = await req.payload.find({
        collection: "products",
        depth: 0,
        where: {
            user: {
                equals: user.id
            }
        }
    })

    const ownProductFileIds = products.map((prod) => prod.product_files).flat()

    const { docs: orders } = await req.payload.find({
        collection: "orders",
        depth: 2,
        where: {
            user: {
                equals: user.id
            }
        }
    })

    const parchusedProductFileIds = orders.map((order) => {
        return order.products.map((product) => {
            if(typeof product === 'string') {
                return req.payload.logger.error("Search depth not sufficient to find parchused file IDs")
            }

            return typeof product.product_files === "string" ? product.product_files : product.product_files.id
        })
    })
    .filter(Boolean)
    .flat()

    return {
        id: {
            in: [...ownProductFileIds, ...parchusedProductFileIds]
        }
    }
  }

export const ProductFiles: CollectionConfig = {
    slug: 'product_file',
    admin: {
        hidden: ({ user }) => user.role !== 'admin'
    },
    hooks: {
        //@ts-ignore
        beforeChange: [addUser],
      },
    access: {
        read: yourOwnOrParchused,
        update: ({ req }) => req.user.role === "admin",
        delete: ({ req }) => req.user.role === "admin"
    },
    upload: {
        staticURL: '/product_files',
        staticDir: 'product_files',
        mimeTypes: ['image/*', 'fonts/*', 'application/postscript']
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                condition: () => false
            },
            hasMany: false,
            required: true
        }
    ]
}