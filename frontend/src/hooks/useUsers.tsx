import { useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://127.0.0.1:3333/v1";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("healthSystemToken");
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = async (skipLoadingControl = false) => {
    if (!skipLoadingControl) {
      setLoading(true);
    }
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar usuários.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      if (!skipLoadingControl) {
        setLoading(false);
      }
    }
  };

  const getUserById = async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const user = await response.json();
        return user;
      } else if (response.status === 404) {
        toast.warning("Usuário não encontrado.");
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    }
    return null;
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success("Usuário cadastrado com sucesso!");
        await fetchUsers(true);
        setLoading(false);
        return true;
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou email já existe.");
        }
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao cadastrar usuário.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const updateUser = async (
    id: number,
    userData: { name: string; email: string }
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success("Usuário atualizado com sucesso!");
        await fetchUsers(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Usuário não encontrado.");
        setLoading(false);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou email já existe.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao atualizar usuário.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const deleteUser = async (id: number, userName: string): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Usuário removido com sucesso!");
        await fetchUsers(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Usuário não encontrado.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao remover usuário.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUsers();
    }
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
