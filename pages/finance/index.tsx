import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useEffect, useState } from "react";
import { Text, Spacer, User, Button } from "@nextui-org/react";
// localhost:3000/article?id=1

const Finance: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const [transactionsData, setTransactionsData] = useState <any>([]); // keep track of data from supabase 
    const [finance, setFinance] = useState<any>({});

    const { id } = router.query;

    const fetchTransactions = async () => {
        try {
          const { data, error } = await supabaseClient
          .from("personalfinance")
          .select("amount,category");
        if (error) {
          console.error(error);
          return;
        } setTransactionsData(data)
         // console.log(data)
        } catch (error) {
          console.log(error)
          
        }
    
      
    
      };
      function getBalance(transactionsdata: any[]) { //use data from supabase
        const expenseData = transactionsdata.filter((transaction) => transaction.category === 'expenses'); //get all exp
        const incomeData = transactionsdata.filter((transaction) => transaction.category === 'incomes'); // get all income
      
        const totalExpenses = expenseData.reduce((acc, current) => acc + parseFloat(current.amount.replace('$', '').replace(',' , '')), 0); // start w total iri 0 ,
      //per array item in expenses remove dollar sign
      //add value to  the current total
        const totalIncomes = incomeData.reduce((acc, current) => acc + parseFloat(current.amount.replace('$', '').replace(',' , '')), 0);
      
        const balance = totalIncomes - totalExpenses;
        return parseFloat(balance.toFixed(2))
      
      
      }
     
       
    useEffect( () => {
        async function getFinance() {
            const {data, error} = await supabaseClient
                .from("personalfinance")
                .select("*")
                .filter("id", "eq", id)
                .single();
            if (error) {
                console.log(error);
            } else {
                setFinance(data);
            }
        }
        if(typeof id !== "undefined") {
            getFinance();
        }
    }, [id])

    useEffect(() => {
        fetchTransactions();
      }, []);

    const deleteFinance = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("personalfinance")
                .delete()
                .eq("id", id)
            if (error) throw error;
            router.push("/mainFeed");
        } catch (error: any) {
            alert(error.message);
        }
    }
    
    return (
        <>
            <Spacer y={1} />
            <Text size="$lg">
                ${getBalance(transactionsData).toFixed(2)}
            </Text>
            <Spacer y={1} />
            <Text h1 size="$lg">
                {finance.transaction}
            </Text>
           
            
            <Spacer y={1} />
            <Text size="$lg">
                {finance.transaction_date}
            </Text>
            <Spacer y={1} />
            <Text size="$lg">
                {finance.amount}
            </Text>
            <Text h2>{finance.category}</Text>
            <Spacer y={.5} />
            <User
                name={finance.user_email?.toLowerCase()}
                size="md"
            />
            
            { user && finance.user_id === user.id ?
                <>
                    <Spacer y={.5} />
                    <Button size="sm" onPress={() => router.push("/editFinance?id=" + id)}> {/* localhost:3000/editArticle */}
                        Edit
                    </Button>
                    <Spacer y={.5} />
                    <Button size="sm" color="error" onPress={() => deleteFinance()}>
                        Delete
                    </Button>
                </>
            : null}
        </>
    )
}

export default Finance;