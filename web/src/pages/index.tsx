import Image from "next/image"
import appPreviewImage from "../assets/app-nlw-copa-preview.png"
import logoImg from "../assets/logo.svg"
import usersAvatarExempleImg from "../assets/users-avatar-exemple.png"
import iconCheckImg from "../assets/icon-check.svg"
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"
import Swal from "sweetalert2"

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("")

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      })

      const { code } = response.data

      navigator.clipboard.writeText(code)

      Swal.fire({
        title: "Sucesso!",
        text: `Bolão foi craido com sucesso, o código ${code} foi copiado para a área de transferência`,
        icon: "success",
        confirmButtonText: "Ok",
        background: "#000",
        color: "#E1E1E6",
        confirmButtonColor: "#129E57",
      })

      setPoolTitle("")
    } catch (err) {
      console.log(err)
      alert("Falha ao criar o bolão, tente novamente!")
      Swal.fire({
        title: "Erro!",
        text: "Falha ao criar o bolão, tente novamente!",
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  return (
    <div className="max-w-screen-sm min-h-full mx-auto grid grid-cols-1 items-center gap-28 py-10 px-6 lg:grid-cols-2 lg:max-w-[1172px]">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExempleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form
          onSubmit={createPool}
          className="mt-10 flex gap-2 flex-col sm:flex-row"
        >
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-3 sm:gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-3 sm:gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
        className="hidden lg:block"
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
