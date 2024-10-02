import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Twitter } from "lucide-react"
import monke from "../assets/monke.jpeg"
import serverless from "../assets/degods-s3.png"
import webalance from "../assets/webalance_clean.png"

const twitterAccounts = [
  {
    name: "Manny",
    handle: "@DeUniGoat",
    image: monke,
  },
  {
    name: "Serverless",
    handle: "@mrhonestpoker",
    image: serverless,
  },
  {
    name: "W3Balance",
    handle: "@w3balance",
    image: webalance,
  },
]

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Contact Us
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2" />
              Email Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Want to learn more? Reach out to us via email:
            </p>
            <Button className="w-full">
              <a
                href="mailto:w3balance@gmail.com"
                className="flex items-center justify-center"
              >
                w3balance@gmail.com
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Twitter className="mr-2" />
              Follow Us on X
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {twitterAccounts.map((account, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img src={account.image} alt={account.name} />
                  </div>
                  <div>
                    <p className="font-semibold text-start">{account.name}</p>
                    <a
                      href={`https://twitter.com/${account.handle.slice(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {account.handle}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
